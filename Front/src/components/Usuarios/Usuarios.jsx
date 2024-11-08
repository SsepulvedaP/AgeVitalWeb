import React, { useEffect, useState } from 'react';
import "./Usuarios.css";
import { getUsers } from 'services/getUsers';
import { registerUser } from 'services/registerUser';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Admin');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Obtener los usuarios al montar el componente
    useEffect(() => {
        getUsers().then((data) => setUsuarios(data));
    }, []);

    // Función para manejar el registro de un nuevo usuario
    // Manejador de registro de usuario
const handleAddUser = async (e) => {
    e.preventDefault();

    if (usuarios.some(user => user.email === email)) {
        alert('El correo electrónico ya está en uso.');
        return;
    }

    console.log("Datos enviados para registro:", username, email, password, role);

    try {
        const newUser = await registerUser(username, email, password, role);
        console.log("Respuesta del servidor:", newUser);

        // Asegúrate de que newUser contiene los datos esperados
        if (newUser && newUser.id) {
            setUsuarios([...usuarios, { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }]);
            resetForm();
        } else {
            console.error("Error: Los datos de newUser son inválidos:", newUser);
        }
    } catch (error) {
        console.error("Error al registrar usuario:", error);
    }
};


    // Función para cargar los datos en el formulario al editar un usuario
    const handleEditUser = (user) => {
        setIsEditing(true);
        setEditId(user.id);
        setUsername(user.username);
        setEmail(user.email);
        setRole(user.role);
        setPassword(''); // Se puede dejar vacío para que el usuario lo actualice si es necesario
    };

    // Función para manejar la actualización de un usuario
    const handleUpdateUser = (e) => {
        e.preventDefault();

        if (usuarios.some(user => user.email === email && user.id !== editId)) {
            alert('El correo electrónico ya está en uso.');
            return;
        }

        setUsuarios(
            usuarios.map((user) =>
                user.id === editId ? { ...user, username, email, role } : user
            )
        );
        resetForm();
    };

    // Función para manejar la eliminación de un usuario
    const handleDeleteUser = (id) => {
        setUsuarios(usuarios.filter((user) => user.id !== id));
    };

    // Función para limpiar el formulario
    const resetForm = () => {
        setUsername('');
        setEmail('');
        setRole('Admin');
        setPassword('');
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="gestion">
            <h2>Gestión de Usuarios</h2>

            {/* Formulario para agregar o editar usuario */}
            <div className="formulario">
                <form onSubmit={isEditing ? handleUpdateUser : handleAddUser}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="Admin">admin</option>
                        <option value="Auxiliar">user</option>
                    </select>
                    <button type="submit">{isEditing ? 'Actualizar' : 'Agregar'}</button>
                </form>
            </div>

            {/* Tabla de usuarios */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <div className="button-container">
                                    <button className="button edit" onClick={() => handleEditUser(user)}>Editar</button>
                                    <button className="button delete" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Usuarios;
