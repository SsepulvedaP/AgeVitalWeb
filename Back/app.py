from flask_bcrypt import Bcrypt
from auth import auth_bp
from Back.config_db_users import Config  
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
    db.create_all()
    
app.register_blueprint(api, url_prefix='/api')
  
if __name__=='__main__': 
    app.run(debug=True)
