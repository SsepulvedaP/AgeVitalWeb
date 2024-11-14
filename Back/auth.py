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
        role=data.get('role', 'user')  # Asigna 'user' como rol por defecto si no se especifica
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

from datetime import timedelta  # Importa timedelta para establecer el tiempo de expiración

# Ruta de inicio de sesión
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        # Incluye el rol en el token de acceso
        additional_claims = {"role": user.role}
        # Establece el tiempo de expiración en 12 horas
        access_token = create_access_token(
            identity=user.id,
            additional_claims=additional_claims,
            expires_delta=timedelta(hours=12)  # Expiración de 12 horas
        )
        return jsonify(access_token=access_token), 200

    return jsonify({"error": "Correo o contraseña incorrectos"}), 401


# Ruta para obtener todos los usuarios registrados
@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users = [user.serialize() for user in users]
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

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Contraseña actualizada exitosamente"}), 200

# Endpoint para eliminar un usuario
@auth_bp.route('/delete_user/<int:user_id>', methods=['DELETE'])
@jwt_required()  # Requiere que el usuario esté autenticado
def delete_user(user_id):
    # Obtener el usuario actual (quien realiza la solicitud)
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Verificar si el usuario es admin
    if current_user.role != 'admin':
        return jsonify({"error": "Acceso denegado: solo los administradores pueden eliminar usuarios"}), 403

    # Obtener el usuario a eliminar
    user_to_delete = User.query.get(user_id)

    if not user_to_delete:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Eliminar el usuario de la base de datos
    db.session.delete(user_to_delete)
    db.session.commit()

    return jsonify({"message": f"Usuario con ID {user_id} eliminado exitosamente"}), 200