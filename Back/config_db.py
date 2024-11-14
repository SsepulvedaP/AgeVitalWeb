import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')  # Para la DB principal (usuarios_db)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    
    # Definir las bases de datos usando SQLALCHEMY_BINDS
    SQLALCHEMY_BINDS = {
        'usuarios_db': os.getenv('SQLALCHEMY_DATABASE_URI'),
        'sensores_db': os.getenv('SQLALCHEMY_SENSORES_DATABASE_URI')
    }
