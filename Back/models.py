from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

# Modelo de Rol
class Role(db.Model):
    __tablename__ = 'roles'
    role_name = db.Column(db.String(20), primary_key=True)
    description = db.Column(db.String(100))

# Modelo de Usuario
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