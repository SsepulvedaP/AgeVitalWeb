import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:upb123@localhost:5432/datos_agesensors'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
