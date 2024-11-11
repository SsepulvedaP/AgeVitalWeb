import psycopg2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import rasterio.transform
from scipy.interpolate import griddata
from rasterio.transform import Affine


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

        points = df_filtered[['latitud', 'longitud']].values
        values = df_filtered['medida_promedio'].values

        grid_x, grid_y = np.mgrid[6.241447:6.241532:1000j, -75.588922:-75.588795:1000j]
        grid_cubic = griddata(points, values, (grid_x, grid_y), method='cubic')

        lon_min = df_filtered['longitud'].min()
        lon_max = df_filtered['longitud'].max()
        lat_min = df_filtered['latitud'].min()
        lat_max = df_filtered['latitud'].max()

        lat_vec = np.linspace(lat_min, lat_max, 1000)
        lon_vec = np.linspace(lon_min, lon_max, 1000)

        xres = (lon_max - lon_min) / 1000
        yres = (lat_max - lat_min) / 1000

        transform = Affine.translation(lon_vec[0] - xres / 2, lat_vec[0] - yres / 2) * Affine.scale(xres, yres)

        
        new_dataset = rasterio.open(
            f'tipo_medicion_{tipo}.tif',
            'w',
            driver='GTiff',
            height=grid_cubic.shape[0],
            width=grid_cubic.shape[1],
            count=1,
            dtype=grid_cubic.dtype,
            crs='EPSG:4326',
            transform=transform,
        )
        new_dataset.write(grid_cubic, 1)
        new_dataset.close()
        
        plt.imshow(grid_cubic.T, extent=(6.241447, 6.241532, -75.588922, -75.588795), origin='lower')
        plt.colorbar()
        plt.title(f"Tipo de medicion: {tipo}")
        plt.xlabel("Longitud")
        plt.ylabel("Latitud")
        plt.show()
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()