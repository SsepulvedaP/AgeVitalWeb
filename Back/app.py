from flask_bcrypt import Bcrypt
from auth import auth_bp 
from config_db import Config
from flask_jwt_extended import JWTManager
from flask import Flask
from flask_cors import CORS
from models import db
from routes import api

app = Flask(__name__)
app.config.from_object(Config)
app.config['CORS_HEADERS'] = 'Content-Type'

# Initialize extensions
db.init_app(app)
bcrypt = Bcrypt(app)  
jwt = JWTManager(app)  
cors = CORS(app)

# Crear tablas para cada base de datos
with app.app_context():
    try:
        db.create_all(bind='usuarios_db')  # Crear tablas en la base de datos usuarios_db
        db.create_all(bind='sensores_db')  # Crear tablas en la base de datos sensores_db
    except Exception as e:
        print(f"Error al crear tablas: {e}")

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
