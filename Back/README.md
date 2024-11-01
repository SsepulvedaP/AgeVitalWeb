<h1 align="center">Sistema Backend del proyecto AgeVital+</h1> 
<h3 align="center">Un proyecto en Flask para manejar registro, inicio de sesión, permisos de usuarios, almacenamiento de datos de sensores e interacción con los mismos.</h3>

<h2>Índice</h2>
<ul>
  <li><a href="#descripción">Descripción</a></li>
  <li><a href="#estructura-del-proyecto">Estructura del proyecto</a></li>
  <li><a href="#instrucciones-de-instalación">Instrucciones de instalación</a></li>
  <li><a href="#cómo-usar-el-proyecto">Cómo usar el proyecto</a></li>
  <li><a href="#tecnologías-usadas">Tecnologías usadas</a></li>
</ul>

<h2 id="descripción">Descripción</h2>
<p>Este proyecto es un sistema de autenticación en Flask que permite el registro, inicio de sesión y modificación de contraseñas para usuarios. Los usuarios tienen roles específicos (<code>admin</code> y <code>user</code>), y solo los administradores pueden cambiar su propia contraseña y la de otros usuarios. A parte del manejo de los diferentes datos medidos por los sensores, como temperatura, ruido, humedad y calidad del aire de la EcoVilla UPB.</p>

<h2 id="estructura-del-proyecto">Estructura del proyecto</h2>

<h3>app.py</h3>
<p>Este archivo es el punto de entrada de la aplicación. Configura Flask y sus extensiones, carga las configuraciones desde <code>config.py</code> y <code>config_db_users.py</code>, e inicializa los módulos principales. También registra las rutas principales a través de los blueprints para manejar las diferentes funcionalidades de autenticación.</p>

<h3>auth.py</h3>
<p>Este archivo define las rutas de autenticación de la aplicación:</p>
<ul>
  <li><strong>/register</strong>: Permite registrar un nuevo usuario con un rol y una contraseña encriptada.</li>
  <li><strong>/login</strong>: Inicia sesión, generando un token de acceso JWT.</li>
  <li><strong>/change_password</strong>: Permite a los administradores cambiar la contraseña de cualquier usuario o la suya propia.</li>
</ul>
<p>Utiliza <code>Flask-JWT-Extended</code> para manejar la autorización basada en tokens y <code>bcrypt</code> para encriptar las contraseñas.</p>

<h3>config.py y config_db_users.py</h3>
<p>Estos archivos contienen la configuración de la aplicación:</p>
<ul>
  <li><strong>config.py</strong>: Carga las variables de entorno desde un archivo <code>.env</code> utilizando <code>python-dotenv</code>. Aquí se configuran las claves secretas y los detalles de conexión a la base de datos.</li>
  <li><strong>config_db_users.py</strong>: Configuración específica de la base de datos de usuarios, necesaria para gestionar roles y permisos.</li>
</ul>

<h3>models.py</h3>
<p>Define los modelos de la base de datos usando SQLAlchemy:</p>
<ul>
  <li><strong>Role</strong>: Tabla para almacenar los roles de usuario (como <code>admin</code> y <code>user</code>).</li>
  <li><strong>User</strong>: Tabla para almacenar los usuarios, incluyendo campos para el nombre de usuario, correo electrónico, contraseña y rol. Los roles se relacionan con la tabla <code>Role</code> mediante una clave foránea.</li>
</ul>
<p>Cada modelo incluye métodos como <code>verify_password</code> para validar contraseñas en el proceso de autenticación.</p>

<h3>routes.py</h3>
<p>Define las rutas adicionales de la API para obtener información de los usuarios:</p>
<ul>
  <li><strong>GET /users</strong>: Permite a los administradores listar todos los usuarios registrados.</li>
</ul>

<h3>docker-compose.yml</h3>
<p>Este archivo configura y orquesta los servicios necesarios para el proyecto. Define dos servicios:</p>
<ul>
  <li><strong>db</strong>: Utiliza una imagen de PostgreSQL y monta los volúmenes para mantener los datos.</li>
  <li><strong>web</strong>: Construye la aplicación de Flask y expone el puerto 5000 para su acceso externo.</li>
</ul>

<h3>requirement.txt</h3>
<p>Lista todas las dependencias necesarias para el proyecto:</p>
<pre><code>Flask
Flask-SQLAlchemy
Flask-Migrate
psycopg2
Flask-CORS
Flask-Bcrypt
Flask-JWT-Extended
psycopg2-binary
python-dotenv
</code></pre>
<p>Este archivo facilita la instalación de todas las librerías con el comando <code>pip install -r requirement.txt</code>.</p>

<h2 id="instrucciones-de-instalación">Instrucciones de instalación</h2>
<ol>
  <li>Clona este repositorio.</li>
  <li>Crea un archivo <code>.env</code> en la raíz del proyecto y configura las variables de entorno necesarias para la base de datos y las claves secretas.</li>
  <li>Construye y levanta los contenedores Docker con:
    <pre><code>docker-compose up --build</code></pre>
  </li>
</ol>

<h2 id="cómo-usar-el-proyecto">Cómo usar el proyecto</h2>
<ol>
  <li>Usa un cliente como Postman para probar las rutas:
    <ul>
      <li><strong>POST /auth/register</strong>: Registra un nuevo usuario.</li>
      <li><strong>POST /auth/login</strong>: Inicia sesión para obtener el token JWT.</li>
      <li><strong>PUT /auth/change_password</strong>: Cambia la contraseña de un usuario (solo para administradores).</li>
    </ul>
  </li>
  <li>Agrega el token JWT en los encabezados de las solicitudes para las rutas protegidas.</li>
</ol>

<h2 id="tecnologías-usadas">Tecnologías usadas</h2>
<ul>
  <li><strong>Python</strong> y <strong>Flask</strong> para el backend.</li>
  <li><strong>PostgreSQL</strong> para la base de datos.</li>
  <li><strong>Docker</strong> para la contenerización.</li>
  <li><strong>Fiware-Orion</strong> para el despliegue de los diferentes servicios.</li>

  
</ul>
<h2 align="center">Tecnologías utilizadas</h2>
<div align="center">
    <a href="https://www.postgresql.org/" target="_blank" rel="noreferrer"> 
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> 
    </a>
    <a href="https://postman.com" target="_blank" rel="noreferrer"> 
        <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" alt="postman" width="40" height="40"/> 
    </a>
    <a href="https://www.python.org" target="_blank" rel="noreferrer"> 
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> 
    </a>
    <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="40" height="40"/>
    </a>
</div>


