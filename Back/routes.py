from flask import Blueprint, jsonify, request
from models import Sensores, TipoMedicion, SensorMedicion, Mediciones, db

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
    # Buscar el sensor por id_sensor
    sensor = db.session.query(Sensores).filter_by(id_sensor=id_sensor).first()
    
    if not sensor:
        return jsonify({"error": "Sensor no encontrado"}), 404

    data = request.get_json()

    # Actualizar los campos del sensor según los datos proporcionados en el JSON
    if 'nombreId' in data:
        sensor.nombre = data['nombreId']
        
    if 'longitud' in data:
        sensor.longitud = data['longitud']
        
    if 'latitud' in data:
        sensor.latitud = data['latitud']

    if 'estado' in data:
        sensor.estado = data['estado']

    # Guardar los cambios en la base de datos
    db.session.commit()

    # Devolver la respuesta con el estado actualizado del sensor
    return jsonify({
        'id_sensor': sensor.id_sensor,  # Devolver id_sensor
        'nombre': sensor.nombre,        # Devolver nombre actualizado
        'longitud': sensor.longitud,
        'latitud': sensor.latitud,
        'estado': sensor.estado
    }), 200

