from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Sensores(db.Model):
    __tablename__ = 'sensores'
    
    id_sensor = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    estado = db.Column(db.String(100))
    ubicacion = db.Column(db.String(100))
    fecha_instalacion = db.Column(db.Date)
    
class TipoMedicion(db.Model):
    __tablename__ = 'tipomedicion'
    
    id_tipo_medicion = db.Column(db.Integer, primary_key=True)
    nombre_tipo = db.Column(db.String(50), nullable=False, unique=True)

class SensorMedicion(db.Model):
    __tablename__ = 'sensormedicion'
    
    id_sensor_medicion = db.Column(db.Integer, primary_key=True)
    id_sensor = db.Column(db.Integer, db.ForeignKey('sensores.id_sensor', ondelete='CASCADE', onupdate='CASCADE'))
    id_tipo_medicion = db.Column(db.Integer, db.ForeignKey('tipomedicion.id_tipo_medicion', ondelete='CASCADE', onupdate='CASCADE'))

    sensor = db.relationship('Sensores', backref='tipo_mediciones')
    tipo_medicion = db.relationship('TipoMedicion', backref='sensores')

class Mediciones(db.Model):
    __tablename__ = 'mediciones'
    
    id_medicion = db.Column(db.Integer, primary_key=True)
    id_sensor = db.Column(db.Integer, db.ForeignKey('sensores.id_sensor', ondelete='CASCADE', onupdate='CASCADE'))
    id_tipo_medicion = db.Column(db.Integer, db.ForeignKey('tipomedicion.id_tipo_medicion', ondelete='CASCADE', onupdate='CASCADE'))
    fecha = db.Column(db.Date, nullable=False)
    medida_maxima = db.Column(db.Numeric(10, 2), nullable=False)
    medida_minima = db.Column(db.Numeric(10, 2), nullable=False)
    medida_promedio = db.Column(db.Numeric(10, 2), nullable=False)

    sensor = db.relationship('Sensores', backref='mediciones_diarias')
    tipo_medicion = db.relationship('TipoMedicion', backref='mediciones_diarias')
