from crate import client

def connect_to_crate():
    try:
        return client.connect('http://10.38.32.137:4200', username='crate')
    except Exception as e:
        print(f"Error al conectar a CrateDB: {e}")
        return None

def update_sensor_entity_id(current_entity_id, new_entity_id, lat=None, lon=None):
    connection = connect_to_crate()
    if connection is None:
        return

    cursor = connection.cursor()
    try:
        # Actualizamos el entity_id, lat y lon si se han proporcionado
        update_query = """
        UPDATE "doc"."etvariables"
        SET entity_id = ?, 
            lat = COALESCE(?, lat), 
            lon = COALESCE(?, lon)
        WHERE entity_id = ?
        """
        # Ejecutamos la consulta con los nuevos valores de entity_id, lat, lon, y el current_entity_id
        cursor.execute(update_query, (new_entity_id, lat, lon, current_entity_id))
        connection.commit()  
        print(f"Sensor actualizado en CrateDB: entity_id de '{current_entity_id}' a '{new_entity_id}', latitud a '{lat}', longitud a '{lon}'.")
    except Exception as e:
        print(f"Error al actualizar sensor en CrateDB: {e}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()

        
def delete_sensor_by_entity_id(entity_id):
    connection = connect_to_crate()
    if connection is None:
        return

    cursor = connection.cursor()
    try:
        delete_query = """
        DELETE FROM "doc"."etvariables"
        WHERE entity_id = ?
        """
        cursor.execute(delete_query, (entity_id,))
        connection.commit()  
        print(f"Sensor con entity_id '{entity_id}' eliminado de CrateDB.")
    except Exception as e:
        print(f"Error al eliminar el sensor en CrateDB: {e}")
        connection.rollback() 
    finally:
        cursor.close()
        connection.close()

