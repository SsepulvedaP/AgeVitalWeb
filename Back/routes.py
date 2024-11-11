import requests
from flask import Blueprint, jsonify, request
from models import Sensores, TipoMedicion, SensorMedicion, Mediciones, db
from crater_connection import update_sensor_entity_id, delete_sensor_by_entity_id

api = Blueprint('api', __name__)

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
    
    if 'nombreId' in data and current_entity_id != new_entity_id:
        try:
            update_sensor_entity_id(current_entity_id, new_entity_id)
        except Exception as e:
            return jsonify({"error": f"Error al actualizar entity_id en CrateDB: {str(e)}"}), 500

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
    db.session.commit()
    
    try:
        delete_sensor_by_entity_id(sensor.nombre)  
    except Exception as e:
        return jsonify({"error": f"Error al eliminar sensor en CrateDB: {str(e)}"}), 500

    return jsonify({"message": f"Sensor con id {id_sensor} eliminado correctamente"}), 200