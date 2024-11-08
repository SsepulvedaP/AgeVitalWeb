from crate import client

# Conexión a CrateDB
def connect_to_crate():
    try:
        return client.connect('http://10.38.32.137:4200', username='crate')
    except Exception as e:
        print(f"Error al conectar a CrateDB: {e}")
        return None

# Actualización del entity_id del sensor
def update_sensor_entity_id(current_entity_id, new_entity_id):
    connection = connect_to_crate()
    if connection is None:
        return

    cursor = connection.cursor()
    try:
        # Consulta para actualizar el entity_id
        update_query = """
        UPDATE "doc"."etvariables"
        SET entity_id = ?
        WHERE entity_id = ?
        """
        # Ejecutar la consulta con los valores actuales y nuevos de entity_id
        cursor.execute(update_query, (new_entity_id, current_entity_id))
        connection.commit()  # Confirmar los cambios
        print(f"entity_id del sensor actualizado de '{current_entity_id}' a '{new_entity_id}' en CrateDB.")
    except Exception as e:
        print(f"Error al actualizar entity_id del sensor en CrateDB: {e}")
        connection.rollback()  # Revertir cambios en caso de error
    finally:
        cursor.close()
        connection.close()
