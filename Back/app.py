from flask import Flask,jsonify,request 
from flask_cors import CORS, cross_origin

app =   Flask(__name__) 
  
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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
