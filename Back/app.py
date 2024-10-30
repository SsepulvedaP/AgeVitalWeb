from flask_bcrypt import Bcrypt
from auth import auth_bp
from config_db import Config  
from flask_jwt_extended import JWTManager
from flask import Flask,jsonify,request 
from flask_cors import CORS, cross_origin
from models import db
from config import Config
from routes import api

app =   Flask(__name__) 
app.config.from_object(Config)
app.config['CORS_HEADERS'] = 'Content-Type'
db.init_app(app)
cors = CORS(app)

with app.app_context():
    db.create_all()  # Crea las tablas
    
app.register_blueprint(api, url_prefix='/api')

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
