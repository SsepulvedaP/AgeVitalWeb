from crate import client
import pandas as pd
from sqlalchemy import create_engine
import psycopg2
import time

# Extracción
def connect_to_crate():
    try:
        return client.connect('http://10.38.32.137:4200', username='crate')
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
        SELECT entity_id, temperatura, humedadrelativa, ruido, timeindex
        FROM "doc"."etvariables"
        WHERE timeindex >= ?
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
def load_data_to_postgres(df):
    engine = create_engine('postgresql://username:password@host:port/Datos_AgeSensors')

    tipo_medicion_map = {
        'temperatura': 1,
        'humedadrelativa': 2,
        'ruido': 3
    }

    with engine.connect() as conn:
        for index, row in df.iterrows():
            for measure_type, tipo_id in tipo_medicion_map.items():
                max_col = f'medida_maxima_{measure_type[:4]}'
                min_col = f'medida_minima_{measure_type[:4]}'
                avg_col = f'medida_promedio_{measure_type[:4]}'
                
                conn.execute("""
                    INSERT INTO Mediciones (id_sensor, id_tipo_medicion, fecha, medida_maxima, medida_minima, medida_promedio)
                    VALUES (%s, %s, CURRENT_DATE, %s, %s, %s)
                """, (
                    row['entity_id'], tipo_id, 
                    row[max_col], row[min_col], row[avg_col]
                ))

def main():
    data = read_data()
    if data is None:
        print("No hay datos en crate.")
        return
    
    df = pd.DataFrame(data, columns=['entity_id', 'temperatura', 'humedadrelativa', 'ruido', 'timeindex'])
    
    df = clean_data(df)
    
    load_data_to_postgres(df)

if __name__ == "__main__":
   main()
