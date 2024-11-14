import requests
from flask import Blueprint, jsonify, request
from models import Sensores, TipoMedicion, SensorMedicion, Mediciones, db
from crater_connection import update_sensor_entity_id, delete_sensor_by_entity_id
from datetime import datetime, timedelta
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)
@api.route('/globalmetrics', methods=['GET'])
def get_global_metrics():
    now = datetime.now()
    last_24_hours = now - timedelta(hours=24)

    tipos_medicion = db.session.query(TipoMedicion).all()
    result = []

    for tipo in tipos_medicion:
        metrics = db.session.query(
            db.func.min(Mediciones.medida_minima).label('minima'),
            db.func.max(Mediciones.medida_maxima).label('maxima'),
            db.func.avg(Mediciones.medida_promedio).label('promedio')
        ).filter(
            Mediciones.id_tipo_medicion == tipo.id_tipo_medicion,
            Mediciones.fecha >= last_24_hours
        ).first()

        result.append({
            'tipo_medicion': tipo.nombre_tipo,
            'minima': metrics.minima,
            'maxima': metrics.maxima,
            'promedio': metrics.promedio
        })

    return jsonify(result)


@api.route('/sensores', methods=['GET'])
def get_sensores():
    sensores = db.session.query(
        Sensores.id_sensor,
        Sensores.nombre,
        Sensores.estado,
        Sensores.latitud,
        Sensores.longitud,
        Sensores.fecha_instalacion,
        TipoMedicion.nombre_tipo
    ).join(SensorMedicion, Sensores.id_sensor == SensorMedicion.id_sensor)\
     .join(TipoMedicion, SensorMedicion.id_tipo_medicion == TipoMedicion.id_tipo_medicion)\
     .all()

    result = []
    for sensor in sensores:
        ultima_medicion = db.session.query(
            Mediciones.medida_maxima,
            Mediciones.medida_minima,
            Mediciones.medida_promedio
        ).filter(Mediciones.id_sensor == sensor.id_sensor)\
         .order_by(Mediciones.fecha.desc())\
         .first()

        result.append({
            'id_sensor': sensor.id_sensor,
            'nombre': sensor.nombre,
            'estado': sensor.estado,
            'latitud': sensor.latitud,
            'longitud': sensor.longitud,
            'fecha_instalacion': sensor.fecha_instalacion,
            'tipo': sensor.nombre_tipo,
            'medida_maxima': ultima_medicion.medida_maxima if ultima_medicion else None,
            'medida_minima': ultima_medicion.medida_minima if ultima_medicion else None
        })

    return jsonify(result)


@api.route('/sensores/<int:id_sensor>', methods=['GET'])
def get_sensor_by_id(id_sensor):
    
    sensor = db.session.query(Sensores).filter_by(id_sensor=id_sensor).first()

    if not sensor:
        return jsonify({"error": "Sensor no encontrado"}), 404

    sensor_data = {
        'id_sensor': sensor.id_sensor,
        'nombre': sensor.nombre,
        'estado': sensor.estado,
        'ubicacion': sensor.ubicacion,
        'fecha_instalacion': sensor.fecha_instalacion
    }

    return jsonify(sensor_data)

@api.route('/mediciones', methods=['GET'])
def get_mediciones():
    mediciones = Mediciones.query.all()
    result = []
    for medicion in mediciones:
        result.append({
            'id_medicion': medicion.id_medicion,
            'id_sensor': medicion.id_sensor,
            'id_tipo_medicion': medicion.id_tipo_medicion,
            'fecha': medicion.fecha,
            'medida_maxima': medicion.medida_maxima,
            'medida_minima': medicion.medida_minima,
            'medida_promedio': medicion.medida_promedio
        })
    return jsonify(result)

#nuevoooooooos
@api.route('/sensores/<int:id_sensor>', methods=['PUT'])
def update_sensor(id_sensor):
    sensor = db.session.query(Sensores).filter_by(id_sensor=id_sensor).first()
    
    if not sensor:
        return jsonify({"error": "Sensor no encontrado"}), 404

    data = request.get_json()
    
    if 'nombreId' not in data:
        return jsonify({"error": "El campo 'nombreId' es requerido para actualizar el id en Orion"}), 400
    
    current_entity_id = sensor.nombre
    new_entity_id = data['nombreId']
    
    # Paso 1: Obtener la entidad actual de Orion
    url_get = f'http://10.38.32.137:1026/v2/entities/{current_entity_id}'
    response = requests.get(url_get)
    
    if response.status_code != 200:
        return jsonify({"error": "No se pudo obtener la entidad de Orion"}), response.status_code

    entity_data = response.json()

    # Paso 2: Modificar el id de la entidad en el JSON
    entity_data['id'] = new_entity_id
    
    # Paso 3: Crear la nueva entidad con el nuevo id en Orion
    url_post = 'http://10.38.32.137:1026/v2/entities'
    headers = {'Content-Type': 'application/json'}
    response_post = requests.post(url_post, headers=headers, json=entity_data)
    
    if response_post.status_code not in [200, 201]:
        return jsonify({"error": "No se pudo crear la entidad con el nuevo id en Orion"}), response_post.status_code

    # Paso 4: Eliminar la entidad anterior en Orion
    url_delete = f'http://10.38.32.137:1026/v2/entities/{current_entity_id}'
    response_delete = requests.delete(url_delete)
    
    if response_delete.status_code != 204:
        return jsonify({"error": "No se pudo eliminar la entidad anterior en Orion"}), response_delete.status_code

    sensor.nombre = new_entity_id
        
    if 'longitud' in data:
        sensor.longitud = data['longitud']
        
    if 'latitud' in data:
        sensor.latitud = data['latitud']

    if 'estado' in data:
        sensor.estado = data['estado']

    db.session.commit()

    return jsonify({
        'id_sensor': sensor.id_sensor,  
        'nombre': sensor.nombre,        
        'longitud': sensor.longitud,
        'latitud': sensor.latitud,
        'estado': sensor.estado
    }), 200

@api.route('/sensores/<int:id_sensor>', methods=['DELETE'])
def delete_sensor(id_sensor):
    sensor = db.session.query(Sensores).filter_by(id_sensor=id_sensor).first()
    
    if not sensor:
        return jsonify({"error": "Sensor no encontrado"}), 404

    db.session.query(Mediciones).filter_by(id_sensor=id_sensor).delete()
    
    db.session.delete(sensor)
    current_entity_id =sensor.nombre
    url_delete = f'http://10.38.32.137:1026/v2/entities/{current_entity_id}'
    response_delete = requests.delete(url_delete)
    
    if response_delete.status_code != 204:
        return jsonify({"error": "No se pudo eliminar la entidad anterior en Orion"}), response_delete.status_code
    
    db.session.commit()
    
    try:
        delete_sensor_by_entity_id(sensor.nombre)  
    except Exception as e:
        return jsonify({"error": f"Error al eliminar sensor en CrateDB: {str(e)}"}), 500

    return jsonify({"message": f"Sensor con id {id_sensor} eliminado correctamente"}), 200


@api.route('/sensores', methods=['POST',  'OPTIONS'])
def create_sensor():
    if request.method == 'OPTIONS':
        response = jsonify({"status": "CORS preflight"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response, 200

    
    data = request.get_json()

    required_fields = ['nombre', 'estado', 'latitud', 'longitud', 'tipos_medicion']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Falta el campo '{field}'"}), 400

    if not isinstance(data['tipos_medicion'], list):
        return jsonify({"error": "'tipos_medicion' debe ser una lista de IDs"}), 400

    tipos_existentes = db.session.query(TipoMedicion).filter(TipoMedicion.id_tipo_medicion.in_(data['tipos_medicion'])).all()
    if len(tipos_existentes) != len(data['tipos_medicion']):
        return jsonify({"error": "Uno o más IDs de tipos de medición no existen"}), 400

    try:
        nuevo_sensor = Sensores(
            nombre=data['nombre'],
            estado=data['estado'],
            latitud=data['latitud'],
            longitud=data['longitud'],
            fecha_instalacion=datetime.now()
        )
        db.session.add(nuevo_sensor)
        db.session.flush() 
        
        for tipo_id in data['tipos_medicion']:
            nueva_asociacion = SensorMedicion(
                id_sensor=nuevo_sensor.id_sensor,
                id_tipo_medicion=tipo_id
            )
            db.session.add(nueva_asociacion)

        db.session.commit()
        
        entity_data = {
            "id": data['nombre'].replace(" ", ""),  
            "type": "variables",  
            "dateObserved": {
                "type": "DateTime",
                "value": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
                "metadata": {}
            }
        }
        
        for tipo_id in data['tipos_medicion']:
            tipo_medicion = next((tm for tm in tipos_existentes if tm.id_tipo_medicion == tipo_id), None)
            if tipo_medicion:
                entity_data[tipo_medicion.nombre_tipo] = {
                    "type": "Number",  
                    "value": 0,  
                    "metadata": {}
                }

        url_post = 'http://10.38.32.137:1026/v2/entities'
        headers = {
            "Content-Type": "application/json"
        }

        response_orion = requests.post(url_post, json=entity_data, headers=headers)

        if response_orion.status_code != 201:
            return jsonify({"error": f"Error al enviar los datos a Orion: {response_orion.text}"}), 500

        return jsonify({
            "id_sensor": nuevo_sensor.id_sensor,
            "nombre": nuevo_sensor.nombre,
            "estado": nuevo_sensor.estado,
            "latitud": nuevo_sensor.latitud,
            "longitud": nuevo_sensor.longitud,
            "fecha_instalacion": nuevo_sensor.fecha_instalacion.strftime("%Y-%m-%d %H:%M:%S"),
            "tipos_medicion": data['tipos_medicion']
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al crear el sensor: {str(e)}"}), 500
    
    
@api.route('/tipos_medicion', methods=['GET'])
def get_tipos_medicion():
    tipos_medicion = db.session.query(TipoMedicion).all()
    result = []
    for tipo in tipos_medicion:
        result.append({
            'id_tipo_medicion': tipo.id_tipo_medicion,
            'nombre_tipo': tipo.nombre_tipo
        })
    return jsonify(result)
