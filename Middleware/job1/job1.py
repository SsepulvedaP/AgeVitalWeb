from crate import client
 
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
        SELECT temperatura, humedadrelativa
        FROM "doc"."etvariables"
        WHERE entity_id = 'UnidaddeMedida1'
        LIMIT 5;
        """
        cursor.execute(query)
        rows = cursor.fetchall()
 
        for row in rows:
            print(row)
    finally:
        cursor.close()
        connection.close()
 
 
if __name__ == "__main__":
    read_data()