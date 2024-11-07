from crate import client
import pandas as pd
import psycopg2
import time
from datetime import datetime

# Extraction
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
        query = """
        SELECT entity_id, temperatura, humedadrelativa, ruido, time_index, lat, lon
        FROM "doc"."etvariables"
        WHERE time_index < ?
        """
        cursor.execute(query, (time.time() - 86400,))
        rows = cursor.fetchall()
        return rows
    finally:
        cursor.close()
        connection.close()

# Transformation
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
        medida_promedio_ruido=pd.NamedAgg(column='ruido', aggfunc='mean'),
        lat = pd.NamedAgg(column='lat', aggfunc='first'),
        lon = pd.NamedAgg(column='lon', aggfunc='first')
    ).reset_index()
    
    grouped = grouped.where(pd.notnull(grouped), None)

    return grouped

# Load
def load_data_to_postgres(df, conn):  
    cur = conn.cursor()

    # Measurement types to check or create in TipoMedicion
    tipo_medicion_map = {
        'temperatura': 'temp',
        'humedadrelativa': 'hum',
        'ruido': 'ruido',
    }
    
    # Check for or insert types into TipoMedicion
    tipo_medicion_ids = {}
    for tipo, prefix in tipo_medicion_map.items():
        cur.execute("SELECT id_tipo_medicion FROM TipoMedicion WHERE nombre_tipo = %s", (tipo,))
        tipo_id = cur.fetchone()
        
        if tipo_id is None:
            cur.execute("INSERT INTO TipoMedicion (nombre_tipo) VALUES (%s) RETURNING id_tipo_medicion", (tipo,))
            tipo_id = cur.fetchone()[0]
            print(f"Tipo de medición '{tipo}' insertado con id {tipo_id}")
        else:
            tipo_id = tipo_id[0]
            print(f"Tipo de medición '{tipo}' encontrado con id {tipo_id}")
        
        tipo_medicion_ids[tipo] = tipo_id

    # Insert sensor data and measurements
    for _, row in df.iterrows():
        nombre = row['entity_id']
        lat = row['lat']
        lon = row['lon']

        # Check for or insert sensor
        cur.execute("SELECT id_sensor FROM Sensores WHERE nombre = %s", (nombre,))
        result = cur.fetchone()
        
        if result is None:
            cur.execute("""
                INSERT INTO Sensores (nombre, estado, latitud, longitud, fecha_instalacion)
                VALUES (%s, %s, %s, %s, CURRENT_DATE) ON CONFLICT (nombre) DO NOTHING
                RETURNING id_sensor
            """, (nombre, 'Activo', lat, lon))
            id_sensor = cur.fetchone()[0]
            print(f"Insertado nuevo sensor con nombre: {nombre}")
        else:
            id_sensor = result[0]
            print(f"Se encontró un sensor existente con el nombre: {nombre}")

        # Insert into SensorMedicion if not exists
        for tipo, tipo_id in tipo_medicion_ids.items():
            cur.execute("""
                SELECT 1 FROM SensorMedicion WHERE id_sensor = %s AND id_tipo_medicion = %s
            """, (id_sensor, tipo_id))
            if not cur.fetchone():
                cur.execute("""
                    INSERT INTO SensorMedicion (id_sensor, id_tipo_medicion)
                    VALUES (%s, %s)
                """, (id_sensor, tipo_id))
                print(f"Relacion creada en SensorMedicion para sensor {id_sensor} y tipo de medicion {tipo_id}")

        # Insert measurements
        for measure_type, prefix in tipo_medicion_map.items():
            max_col = f'medida_maxima_{prefix}'
            min_col = f'medida_minima_{prefix}'
            avg_col = f'medida_promedio_{prefix}'

            if pd.notna(row[max_col]) and pd.notna(row[min_col]) and pd.notna(row[avg_col]):
                values = (id_sensor, tipo_medicion_ids[measure_type], row[max_col], row[min_col], row[avg_col])
                
                try:
                    cur.execute("""
                        INSERT INTO Mediciones (id_sensor, id_tipo_medicion, fecha, medida_maxima, medida_minima, medida_promedio)
                        VALUES (%s, %s, CURRENT_DATE, %s, %s, %s)
                    """, values)
                    print(f"Insertadas mediciones para sensor {id_sensor} de tipo {tipo_medicion_ids[measure_type]} con nombre {nombre}")
                except psycopg2.errors.ForeignKeyViolation as e:
                    print(f"No se logró insertar mediciones para sensor {id_sensor} con nombre {nombre}. Error: {e}")
                    conn.rollback()

def main():
    data = read_data()
    if data is None:
        print("No hay datos en crate.")
        return
    
    df = pd.DataFrame(data, columns=['entity_id', 'temperatura', 'humedadrelativa', 'ruido', 'time_index', 'lat', 'lon'])
    df = clean_data(df)
    
    conn = psycopg2.connect(database="sensores_db",
                            user="upb123",
                            password="upb123",
                            host="10.38.32.137",
                            port="5436")

    load_data_to_postgres(df, conn)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()
