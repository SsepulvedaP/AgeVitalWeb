from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
db = SQLAlchemy()
bcrypt = Bcrypt()

class Sensores(db.Model):
    __tablename__ = 'sensores'
    
    id_sensor = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    estado = db.Column(db.String(100))
    latitud = db.Column(db.Float)
    longitud = db.Column(db.Float) 
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
    

class Role(db.Model):
    __tablename__ = 'roles'
    role_name = db.Column(db.String(20), primary_key=True)
    description = db.Column(db.String(100))

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), db.ForeignKey('roles.role_name'))

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
    def set_password(self, new_password):
        self.password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role
        }
