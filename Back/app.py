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

@app.route('/trial', methods = ['GET']) 
def ReturnJSON(): 
    if(request.method == 'GET'): 
        data = { 
            "Sensor" : "Temperature", 
            "Value" : 22.4, 
        }
        return jsonify(data) 
  
if __name__=='__main__': 
    app.run(debug=True)
