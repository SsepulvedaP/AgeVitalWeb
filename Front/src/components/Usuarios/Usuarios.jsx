import React, { useState } from 'react';
import "./Usuarios.css";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: 'Admin', email: 'admin@example.com', rol: 'Admin' },
        { id: 2, nombre: 'User1', email: 'user1@example.com', rol: 'Auxiliar' }
    ]);

    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('Admin'); // Estado para el campo Rol
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleAddUser = (e) => {
        e.preventDefault();
        if (usuarios.some(user => user.id === parseInt(id))) {
            alert('El ID ya está en uso.');
            return;
        }
        if (usuarios.some(user => user.email === email)) {
            alert('El correo electrónico ya está en uso.');
            return;
        }

        const newUser = {
            id: parseInt(id),
            nombre,
            email,
            rol
        };
        setUsuarios([...usuarios, newUser]);
        resetForm();
    };

    const handleEditUser = (user) => {
        setIsEditing(true);
        setEditId(user.id);
        setId(user.id);
        setNombre(user.nombre);
        setEmail(user.email);
        setRol(user.rol);
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        if (usuarios.some(user => user.email === email && user.id !== editId)) {
            alert('El correo electrónico ya está en uso.');
            return;
        }

        setUsuarios(
            usuarios.map((user) =>
                user.id === editId ? { ...user, nombre, email, rol } : user
            )
        );
        resetForm();
    };

    const handleDeleteUser = (id) => {
        setUsuarios(usuarios.filter((user) => user.id !== id));
    };

    const resetForm = () => {
        setId('');
        setNombre('');
        setEmail('');
        setRol('Admin'); // Resetear el rol al valor por defecto
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
                        placeholder="ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        required
                    >
                        <option value="Admin">Admin</option>
                        <option value="Auxiliar">Auxiliar</option>
                    </select>
                    <button type="submit">{isEditing ? 'Actualizar' : 'Agregar'}</button>
                </form>
            </div>

            {/* Tabla de usuarios */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nombre}</td>
                            <td>{user.email}</td>
                            <td>{user.rol}</td>
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
