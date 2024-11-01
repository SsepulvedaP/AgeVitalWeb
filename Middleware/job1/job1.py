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
        
        query = """
        SELECT entity_id, temperatura, humedadrelativa, ruido, time_index
        FROM "doc"."etvariables"
        WHERE time_index >= ?
        """
        cursor.execute(query, (time.time()-86400,))
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
    
    df.loc[~temp_valid, 'temperatura'] = pd.NA
    df.loc[~humidity_valid, 'humedadrelativa'] = pd.NA
    df.loc[~noise_valid, 'ruido'] = pd.NA
    
    grouped = df.groupby('entity_id').agg(
        medida_maxima_temp=pd.NamedAgg(column='temperatura', aggfunc='max'),
        medida_minima_temp=pd.NamedAgg(column='temperatura', aggfunc='min'),
        medida_promedio_temp=pd.NamedAgg(column='temperatura', aggfunc='mean'),
        medida_maxima_hum=pd.NamedAgg(column='humedadrelativa', aggfunc='max'),
        medida_minima_hum=pd.NamedAgg(column='humedadrelativa', aggfunc='min'),
        medida_promedio_hum=pd.NamedAgg(column='humedadrelativa', aggfunc='mean'),
        medida_maxima_ruido=pd.NamedAgg(column='ruido', aggfunc='max'),
        medida_minima_ruido=pd.NamedAgg(column='ruido', aggfunc='min'),
        medida_promedio_ruido=pd.NamedAgg(column='ruido', aggfunc='mean')
    ).reset_index()
    
    grouped = grouped.where(pd.notnull(grouped), None)

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
        nombre = row['entity_id']

        cur.execute("SELECT nombre FROM Sensores WHERE nombre = %s", (nombre,))
        result = cur.fetchone()

        if result is None:
            cur.execute("""
                INSERT INTO Sensores (nombre, estado, latitud, longitud, fecha_instalacion)
                VALUES (%s, %s, %s, %s, CURRENT_DATE) ON CONFLICT (nombre) DO NOTHING
            """, (nombre, 'Activo', 6, -75))
            print(f"Insertado nuevo sensor con nombre: {nombre}")
        else:
            print(f"Se encontró un sensor existente con el nombre: {nombre}")

        for measure_type, (prefix, tipo_id) in tipo_medicion_map.items():
            max_col = f'medida_maxima_{prefix}'
            min_col = f'medida_minima_{prefix}'
            avg_col = f'medida_promedio_{prefix}'

            if pd.notna(row[max_col]) and pd.notna(row[min_col]) and pd.notna(row[avg_col]):
                cur.execute("SELECT id_sensor FROM Sensores WHERE nombre = %s", (nombre,))
                id_sensor = cur.fetchone()[0]
                values = (id_sensor, tipo_id, row[max_col], row[min_col], row[avg_col])

                try:
                    cur.execute("""
                        INSERT INTO Mediciones (id_sensor, id_tipo_medicion, fecha, medida_maxima, medida_minima, medida_promedio)
                        VALUES (%s, %s, CURRENT_DATE, %s, %s, %s)
                    """, values)
                    print(f"Insertadas mediciones para sensor {id_sensor} de tipo {tipo_id} con nombre {nombre}")
                except psycopg2.errors.ForeignKeyViolation as e:
                    print(f"No se logro insertar mediciones para sensor {id_sensor} con nombre {nombre}. Error: {e}")
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
