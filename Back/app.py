# app.py
from flask import Flask, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config_db import Config  
from models import db
from auth import auth_bp  # Importa el blueprint de autenticación

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos y JWT
app.config.from_object(Config)
db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Crea las tablas en la base de datos si no existen
with app.app_context():
    db.create_all()

# Registro del blueprint de autenticación
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/trial', methods=['GET'])
def ReturnJSON():
    data = {
        "Sensor": "Temperature",
        "Value": 22.4,
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
