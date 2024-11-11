from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin
from config import Config
from models import db
from auth import auth_bp  # Importa el blueprint de autenticación
from routes import api 
import os 

app = Flask(__name__)
app.config.from_object(Config)
app.config['CORS_HEADERS'] = 'Content-Type'

db.init_app(app)
bcrypt = Bcrypt(app)  
jwt = JWTManager(app)  
cors = CORS(app)
app.config.from_object(Config)
app.config['CORS_HEADERS'] = 'content-type'

with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(api,url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)