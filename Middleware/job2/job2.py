import psycopg2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import griddata
import mpld3
import IPython
import json
from pathlib import Path


def get_sensors_in_bounds(conn):
    cursor = conn.cursor()
    query = """
    SELECT * FROM sensores
    WHERE latitud BETWEEN %s AND %s
    AND longitud BETWEEN %s AND %s
    """
    cursor.execute(query, (6.241447, 6.241532, -75.588922, -75.588795))
    sensors = cursor.fetchall()
    cursor.close()
    return sensors

def get_measurements_by_sensor_and_type(conn, sensor_id):
    cursor = conn.cursor()
    query = """
    SELECT t.nombre_tipo,
           t.id_tipo_medicion,
           m.medida_maxima, 
           m.medida_minima, 
           m.medida_promedio,
           m.fecha,
           s.latitud,
           s.longitud
    FROM mediciones m
    JOIN tipomedicion t ON m.id_tipo_medicion = t.id_tipo_medicion
    JOIN sensores s ON m.id_sensor = s.id_sensor
    WHERE m.id_sensor = %s
    GROUP BY t.nombre_tipo, t.id_tipo_medicion, m.medida_maxima, m.medida_minima, m.medida_promedio, m.fecha, s.latitud, s.longitud
    """
    cursor.execute(query, (sensor_id,))
    measurements = cursor.fetchall()
    cursor.close()
    return measurements

def main():
    conn = psycopg2.connect(database="datos_agesensors",
                            user="postgres",
                            password="upb123",
                            host="localhost",
                            port="5432")

    sensors_in_bounds = get_sensors_in_bounds(conn)
    data = []
    for sensor in sensors_in_bounds:
        sensor_id = sensor[0]
        latest_measurement = get_measurements_by_sensor_and_type(conn, sensor_id)
        if latest_measurement:
            for measurement in latest_measurement:
                data.append({
                    'id_tipo_medicion': measurement[1],
                    'medida_promedio': measurement[4],
                    'latitud': measurement[6],
                    'longitud': measurement[7]
                })    
    df = pd.DataFrame(data).astype({'id_tipo_medicion': 'int64', 'medida_promedio': 'float64', 'latitud': 'float64', 'longitud': 'float64'})

    for tipo in df['id_tipo_medicion'].unique():
        df_filtered = df[df['id_tipo_medicion'] == tipo]
        floor = 1

        points = df_filtered[['latitud', 'longitud']].values
        values = df_filtered['medida_promedio'].values

        grid_x, grid_y = np.mgrid[6.241447:6.241532:1000j, -75.588922:-75.588795:1000j]
        grid_cubic = griddata(points, values, (grid_x, grid_y), method='cubic')

        base_path = Path(__file__).parent.parent.parent.as_posix()
        image_path = base_path+"/Middleware/job2/"
        img = plt.imread(image_path + "PrimerPlanta.png")

        output_path = base_path+"/Front/src/assets/interpolaciones"
        plt.figure(figsize=(37/2.54, 11/2.54))
        plt.imshow(grid_cubic, extent=(-75.588922, -75.588795, 6.241447, 6.241532), origin='lower')
        plt.imshow(img, extent=(-75.588922, -75.588795, 6.241447, 6.241532), aspect='equal')
        plt.colorbar()
        plt.clim(df_filtered['medida_promedio'].min(), df_filtered['medida_promedio'].max())
        fig = plt.gcf()
        fid_name = mpld3.fig_to_dict(fig)
        output_path = base_path+"/Front/src/assets/interpolaciones"
        with open(output_path+f'/interpolation_{tipo}_floor_{floor}.json', 'w') as f:
            json.dump(fid_name, f)
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()