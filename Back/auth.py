# auth.py
from flask import Blueprint, request, jsonify
from models import db, bcrypt, User
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

# Ruta de registro de usuario
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        role=data.get('role', 'admin')  # Asigna 'user' como rol por defecto si no se especifica
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

# Ruta de inicio de sesión
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

    return jsonify({"error": "Correo o contraseña incorrectos"}), 401

# Ruta para obtener todos los usuarios registrados
@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users = [user.serialize() for user in users]  # Serializar cada usuario
    return jsonify(users), 200


# Ruta para cambiar la contraseña
@auth_bp.route('/change_password', methods=['PUT'])
@jwt_required()
def change_password():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Verificar si el usuario es admin
    if current_user.role != 'admin':
        return jsonify({"error": "Acceso denegado"}), 403

    # Validar que se haya proporcionado el ID del usuario y la nueva contraseña
    user_id = data.get('user_id', current_user_id)  # Por defecto, cambia su propia contraseña
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"error": "Se requiere una nueva contraseña"}), 400

    # Obtener el usuario a modificar
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Cambiar la contraseña
    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Contraseña actualizada exitosamente"}), 200