from flask import Blueprint, jsonify
from models import Sensores, TipoMedicion, SensorMedicion, Mediciones, db

api = Blueprint('api', __name__)

@api.route('/sensores', methods=['GET'])
def get_sensores():
    sensores = Sensores.query.all()
    result = []
    for sensor in sensores:
        result.append({
            'id_sensor': sensor.id_sensor,
            'nombre': sensor.nombre,
            'estado': sensor.estado,
            'ubicacion': sensor.ubicacion,
            'fecha_instalacion': sensor.fecha_instalacion
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
