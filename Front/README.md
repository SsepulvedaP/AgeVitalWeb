<h1 align="center">FrontEnd AgeVital UPB</h1>
<h3 align="center">Monitorización de la salud de adultos mayores mediante IoT</h3>

<p align="center">
    AgeVital+ es un proyecto orientado a la monitorización de la salud de adultos mayores mediante el uso de tecnologías IoT. A través de sensores no invasivos, se recopilan datos vitales y ambientales, permitiendo la detección temprana de factores de riesgo y enfermedades silenciosas. El frontend facilita la visualización y gestión de estos datos, brindando una interfaz amigable y accesible para los usuarios.
</p>

<h2>Tabla de contenidos</h2>
<ul>
  <li><a href="#instalación">Instalación</a></li>
  <li><a href="#uso">Uso</a></li>
  <li><a href="#estructura-del-proyecto">Estructura del Proyecto</a></li>
  <li><a href="#componentes-y-paginas">Componentes y Páginas</a></li>
  <li><a href="#contribución">Contribución</a></li>
  <li><a href="#licencia">Licencia</a></li>
  <li><a href="#contacto">Contacto</a></li>
</ul>

<h2 id="instalación">Instalación</h2>
<p>Instrucciones sobre cómo instalar el proyecto de manera local y poder interactuar con los diferentes contenidos.</p>

<blockquote>
  <p><strong>Nota:</strong> Solicitar permisos necesarios para agregarlo como colaborador.</p>
</blockquote>

<pre><code># Comando de ejemplo para clonar el proyecto.
git clone https://github.com/SsepulvedaP/AgeVitalWeb.git

# Navegar dentro del proyecto.
cd AgeVitalWeb

# Instalar dependencias.
npm install
</code></pre>

<h2 id="uso">Uso</h2>
<p>Para iniciar el proyecto localmente, utiliza el siguiente comando:</p>

<pre><code>npm run start</code></pre>

<h2 id="estructura-del-proyecto">Estructura del Proyecto</h2>
<p>La estructura principal del proyecto incluye las siguientes carpetas:</p>

<ul>
  <li><strong>assets</strong>: Almacena archivos estáticos como imágenes, iconos y otros recursos visuales.</li>
  <li><strong>components</strong>: Contiene los componentes reutilizables del proyecto, organizados en subcarpetas según la funcionalidad.</li>
  <ul>
      <li><strong>Admin</strong>: Componentes específicos para la administración de la plataforma.</li>
      <li><strong>Dashboard</strong>: Pantalla principal que muestra un resumen de la información de los sensores y el estado del sistema.</li>
      <li><strong>Ecovilla</strong>: Representación de datos específicos relacionados con la EcoVilla UPB, destacando su ambiente y variables relevantes.</li>
      <li><strong>Mapa</strong>: Componente para visualizar la ubicación geográfica de los sensores en el campus de la universidad.</li>
      <li><strong>Usuarios</strong>: Componentes para gestionar la información de los usuarios registrados en la plataforma.</li>
      <li><strong>shared</strong>: Componentes compartidos entre varias partes de la aplicación, como botones, cuadros de información, etc.</li>
  </ul>
  <li><strong>services</strong>: Incluye servicios como <code>getSensorData.jsx</code> que contiene la lógica para obtener datos de los sensores desde el backend.</li>
  <li><strong>index.js</strong>: Punto de entrada del frontend donde se realiza el renderizado de la aplicación.</li>
  <li><strong>Main.jsx</strong>: Archivo principal que contiene la estructura general de la aplicación.</li>
</ul>

<h2 id="componentes-y-paginas">Componentes y Páginas</h2>
<p>A continuación se explican algunos de los componentes y páginas principales de la aplicación:</p>

<ul>
  <li><strong>Home</strong>: Página introductoria que brinda información sobre AgeVital+, incluyendo los objetivos y beneficios del proyecto para el monitoreo de la salud.</li>
  <li><strong>Mapa Interactivo</strong>: Muestra un mapa con la ubicación de los sensores en el campus de la universidad. Cada sensor incluye etiquetas de información que muestran datos como temperatura, humedad y estado actual.</li>
  <li><strong>Visualización de Sensores</strong>: Presenta una serie de tarjetas que detallan el estado de cada sensor, como ID, ubicación, tipo de sensor, y estado (activo, inactivo, dañado).</li>
  <li><strong>Monitoreo en Tiempo Real</strong>: Permite a los usuarios observar las variables capturadas por los sensores en tiempo real, mostrando actualizaciones constantes para facilitar la toma de decisiones.</li>
</ul>

<h2 id="contribución">Contribución</h2>
<p>Para contribuir al proyecto, sigue estos pasos:</p>

<pre><code># Haz un fork del proyecto.
# Crea una rama para tu feature
git checkout -b feature/AmazingFeature

# Realiza los cambios necesarios y haz un commit
git commit -m 'Add some AmazingFeature'

# Sube tus cambios a la rama
git push origin feature/AmazingFeature

# Abre un Pull Request
</code></pre>

<h2 id="licencia">Licencia</h2>
<p>Este proyecto está bajo las políticas de privacidad y protección de la Universidad Pontificia Bolivariana.</p>

<h2 id="contacto">Contacto</h2>
<p>Para más información o soporte, puedes contactar a los integrantes del equipo:</p>
<ul>
  <li>Samuel Santa Jaramillo - <a href="mailto:samuel.santaj@upb.edu.co">samuel.santaj@upb.edu.co</a></li>
  <li>Mateo González Tobón - <a href="mailto:mateo.gonzalezt@upb.edu.co">mateo.gonzalezt@upb.edu.co</a></li>
  <li>Sebastián Sepúlveda Patiño - <a href="mailto:sebastian.sepulvedap@upb.edu.co">sebastian.sepulvedap@upb.edu.co</a></li>
  <li>Valeria Paola Padilla Hoyos - <a href="mailto:valeria.padillah@upb.edu.co">valeria.padillah@upb.edu.co</a></li>
</ul>

<h2 align="center">Tecnologías Utilizadas</h2>
<div align="center">
    <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> 
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="React" width="40" height="40"/> 
    </a>
    <a href="https://nodejs.org/" target="_blank" rel="noreferrer"> 
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="Node.js" width="40" height="40"/> 
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> 
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" width="40" height="40"/> 
    </a>
    <a href="https://www.npmjs.com/" target="_blank" rel="noreferrer">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" alt="NPM" width="40" height="40"/>
    </a>
    <a href="https://www.postgresql.org/" target="_blank" rel="noreferrer"> 
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="PostgreSQL" width="40" height="40"/> 
    </a>
</div>
