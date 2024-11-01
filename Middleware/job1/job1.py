from crate import client
import pandas as pd
from sqlalchemy import create_engine
import psycopg2
import time
from datetime import datetime

# Extracción
def connect_to_crate():
    try:
        return client.connect('http://localhost:4200', username='crate')
    except Exception as e:
        print(f"Error al conectar a CrateDB: {e}")
        return None

def read_data():
    connection = connect_to_crate()
    if connection is None:
        return
    
    cursor = connection.cursor()
    try:
        last_24_hours = int(time.time() - 24 * 3600)
        
        query = """
        SELECT entity_id, temperatura, humedadrelativa, ruido, time_index
        FROM "doc"."etvariables"
        WHERE time_index >= ?
        """
        cursor.execute(query, (last_24_hours,))
        rows = cursor.fetchall()
        return rows
    finally:
        cursor.close()
        connection.close()

# Transformación
def clean_data(df):
    temp_valid = (df['temperatura'] >= 0) & (df['temperatura'] <= 50)
    humidity_valid = (df['humedadrelativa'] >= 0) & (df['humedadrelativa'] <= 100)
    noise_valid = (df['ruido'] >= 0) & (df['ruido'] <= 130)
    df = df[temp_valid & humidity_valid & noise_valid]
    
    grouped = df.groupby('entity_id').agg(
        medida_maxima_temp=('temperatura', 'max'),
        medida_minima_temp=('temperatura', 'min'),
        medida_promedio_temp=('temperatura', 'mean'),
        medida_maxima_hum=('humedadrelativa', 'max'),
        medida_minima_hum=('humedadrelativa', 'min'),
        medida_promedio_hum=('humedadrelativa', 'mean'),
        medida_maxima_ruido=('ruido', 'max'),
        medida_minima_ruido=('ruido', 'min'),
        medida_promedio_ruido=('ruido', 'mean')
    ).reset_index()
    return grouped

# Carga
def load_data_to_postgres(df, conn):  
    cur = conn.cursor()

    tipo_medicion_map = {
        'temperatura': ('temp', 1),
        'humedadrelativa': ('hum', 2),
        'ruido': ('ruido', 3)
    }

    for _, row in df.iterrows():
        id_sensor = row['entity_id']

        cur.execute("SELECT id_sensor FROM Sensores WHERE id_sensor = %s", (id_sensor,))
        result = cur.fetchone()

        if result is None:
            cur.execute("""
                INSERT INTO Sensores (id_sensor, latitud, longitud, fecha_instalacion)
                VALUES (%s, %s, %s, CURRENT_DATE) ON CONFLICT (id_sensor) DO NOTHING
            """, (id_sensor, 6, -75))
            print(f"Inserted new sensor with id_sensor: {id_sensor}")
        else:
            print(f"Found existing sensor with id_sensor: {id_sensor}")

        current_date = datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d')

        for measure_type, (prefix, tipo_id) in tipo_medicion_map.items():
            max_col = f'medida_maxima_{prefix}'
            min_col = f'medida_minima_{prefix}'
            avg_col = f'medida_promedio_{prefix}'

            if pd.notna(row[max_col]) and pd.notna(row[min_col]) and pd.notna(row[avg_col]):
                values = (id_sensor, tipo_id, current_date, row[max_col], row[min_col], row[avg_col])

                try:
                    cur.execute("""
                        INSERT INTO Mediciones (id_sensor, id_tipo_medicion, fecha, medida_maxima, medida_minima, medida_promedio)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, values)
                    print(f"Inserted measurement for sensor {id_sensor} with tipo_id {tipo_id}")
                except psycopg2.errors.ForeignKeyViolation as e:
                    print(f"ForeignKeyViolation: Could not insert measurement for id_sensor {id_sensor}. Error: {e}")
                    conn.rollback()

def main():
    data = read_data()
    if data is None:
        print("No hay datos en crate.")
        return
    
    df = pd.DataFrame(data, columns=['entity_id', 'temperatura', 'humedadrelativa', 'ruido', 'timeindex'])
    
    df = clean_data(df)
    
    conn = psycopg2.connect(database="datos_agesensors",
                            user="postgres",
                            password="upb123",
                            host="127.0.0.1",
                            port="5432")

    load_data_to_postgres(df, conn)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()
