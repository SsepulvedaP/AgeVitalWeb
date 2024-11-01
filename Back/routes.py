from flask import Blueprint, jsonify
from models import Sensores, TipoMedicion, SensorMedicion, Mediciones, db

api = Blueprint('api', __name__)

@api.route('/sensores', methods=['GET'])
def get_sensores():
    # Realiza una consulta para obtener la información del sensor junto con las medidas.
    sensores = db.session.query(
        Sensores.id_sensor,
        Sensores.nombre,
        Sensores.estado,
        Sensores.latitud,
        Sensores.longitud,
        Sensores.fecha_instalacion,
        TipoMedicion.nombre_tipo,
        Mediciones.medida_maxima,
        Mediciones.medida_minima
    ).join(SensorMedicion, Sensores.id_sensor == SensorMedicion.id_sensor)\
     .join(TipoMedicion, SensorMedicion.id_tipo_medicion == TipoMedicion.id_tipo_medicion)\
     .outerjoin(Mediciones, SensorMedicion.id_sensor == Mediciones.id_sensor).all()  # Usa outerjoin para incluir sensores sin mediciones

    result = []
    for sensor in sensores:
        result.append({
            'id_sensor': sensor.id_sensor,
            'nombre': sensor.nombre,
            'estado': sensor.estado,
            'latitud': sensor.latitud, 
            'longitud': sensor.longitud,
            'fecha_instalacion': sensor.fecha_instalacion,
            'tipo': sensor.nombre_tipo,
            'medida_maxima': sensor.medida_maxima,
            'medida_minima': sensor.medida_minima
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
