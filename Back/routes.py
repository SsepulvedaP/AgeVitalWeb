from flask import Blueprint, jsonify
from models import Sensores, TipoMedicion, SensorMedicion, Mediciones, db

api = Blueprint('api', __name__)

@api.route('/sensores', methods=['GET'])
def get_sensores():
    sensores = db.session.query(
        Sensores.id_sensor,
        Sensores.nombre,
        Sensores.estado,
        Sensores.ubicacion,
        Sensores.fecha_instalacion,
        TipoMedicion.nombre_tipo
    ).join(SensorMedicion, Sensores.id_sensor == SensorMedicion.id_sensor)\
     .join(TipoMedicion, SensorMedicion.id_tipo_medicion == TipoMedicion.id_tipo_medicion).all()

    result = []
    for sensor in sensores:
        result.append({
            'id_sensor': sensor.id_sensor,
            'nombre': sensor.nombre,
            'estado': sensor.estado,
            'ubicacion': sensor.ubicacion,
            'fecha_instalacion': sensor.fecha_instalacion,
            'tipo': sensor.nombre_tipo            
        })
    return jsonify(result)

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
