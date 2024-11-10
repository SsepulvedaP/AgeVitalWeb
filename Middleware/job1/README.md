<h1 align="center">Sistema de Middleware de ETL para AgeVital+</h1>
<h3 align="center">Un servicio en Python que realiza la extracción, transformación y carga de datos desde CrateDB para su análisis e interacción por parte de los usuarios</h3>

<h2>Índice</h2>
<ul>
  <li><a href="#descripción">Descripción</a></li>
  <li><a href="#estructura-del-proyecto">Estructura del proyecto</a></li>
  <li><a href="#instrucciones-de-instalación">Instrucciones de instalación</a></li>
  <li><a href="#cómo-usar-el-proyecto">Cómo usar el proyecto</a></li>
  <li><a href="#tecnologías-usadas">Tecnologías usadas</a></li>
</ul>

<h2 id="descripción">Descripción</h2>
<p>Este servicio de middleware se encarga de procesar los datos de la EcoVilla UPB en un flujo ETL (Extracción, Transformación y Carga). Extrae datos desde la base de datos CrateDB, los transforma según las necesidades del análisis y los prepara para ser mostrados a los usuarios. Esto permite a los usuarios finales interactuar con los datos y obtener conclusiones significativas sobre variables como temperatura, calidad del aire, humedad, entre otros.</p>

<h2 id="estructura-del-proyecto">Estructura del proyecto</h2>

<h3>job1.py</h3>
<p>Este archivo contiene el trabajo principal de ETL, el cual se ejecuta periódicamente para actualizar los datos procesados. Sus funciones clave incluyen:</p>
<ul>
  <li><strong>Extracción</strong>: Obtiene datos de CrateDB relacionados con sensores específicos, como temperatura y calidad del aire.</li>
  <li><strong>Transformación</strong>: Realiza limpieza y formateo de datos, convirtiendo valores no válidos y aplicando cálculos necesarios para el análisis.</li>
  <li><strong>Carga</strong>: Almacena los datos transformados en una base de datos o los envía al sistema final de presentación.</li>
</ul>
<p>Este script asegura que los datos estén actualizados y listos para su consulta e interpretación.</p>

<h3>cronjob</h3>
<p>Este archivo define un trabajo cron que ejecuta el proceso de ETL en intervalos específicos. Por ejemplo, se puede configurar para que el <code>job1.py</code> se ejecute cada hora, cada día o con la frecuencia que se requiera para mantener los datos al día.</p>

<h3>Dockerfile</h3>
<p>El Dockerfile configura el entorno de ejecución del servicio, asegurando que las dependencias necesarias estén instaladas y el proceso ETL esté preparado para ejecutarse en un contenedor Docker. Este archivo incluye los siguientes pasos:</p>
<ul>
  <li>Instalación de Python y sus dependencias.</li>
  <li>Copia de los archivos de ETL y configuración del cron job.</li>
  <li>Configuración de los permisos necesarios para ejecutar el cron y los scripts de ETL.</li>
</ul>

<h3>docker-compose.yml</h3>
<p>Este archivo orquesta los servicios de Docker necesarios, incluyendo la base de datos CrateDB y el contenedor del servicio de ETL. Configura los volúmenes persistentes para almacenar los datos y define las redes para que los servicios se puedan comunicar entre sí.</p>

<h2 id="instrucciones-de-instalación">Instrucciones de instalación</h2>
<ol>
  <li>Clona este repositorio.</li>
  <li>Crea un archivo <code>.env</code> en la raíz del proyecto para configurar las variables de entorno necesarias, como la conexión a CrateDB.</li>
  <li>Construye y levanta los contenedores Docker con:
    <pre><code>docker-compose up --build</code></pre>
  </li>
</ol>

<h2 id="cómo-usar-el-proyecto">Cómo usar el proyecto</h2>
<ol>
  <li>Usa un cliente de API como Postman o el navegador para acceder a los datos procesados a través de las rutas definidas en el servicio de backend.</li>
  <li>Revisa el estado de los cron jobs en el contenedor para asegurarte de que el ETL se está ejecutando en el intervalo deseado.</li>
  <li>Consulta los datos actualizados en el sistema de presentación de usuarios para análisis y toma de decisiones.</li>
</ol>

<h2 id="tecnologías-usadas">Tecnologías usadas</h2>
<ul>
  <li><strong>Python</strong> para la programación del flujo ETL.</li>
  <li><strong>CrateDB</strong> como base de datos de almacenamiento de datos de sensores.</li>
  <li><strong>Docker</strong> para la contenerización del servicio de ETL y la base de datos.</li>
  <li><strong>Cron</strong> para la programación de la ejecución periódica del proceso ETL.</li>
</ul>

<h2 align="center">Tecnologías utilizadas</h2>
<div align="center">
    <a href="https://www.python.org/" target="_blank" rel="noreferrer"> 
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="Python" width="40" height="40"/> 
    </a>
    <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> 
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="Docker" width="40" height="40"/>
    </a>
</div>
