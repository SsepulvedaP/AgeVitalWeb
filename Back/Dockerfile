# Usa una imagen base de Python
FROM python:3.9

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Actualiza pip a la última versión
RUN pip install --upgrade pip

# Copia solo requirements.txt antes para aprovechar la caché de Docker en instalaciones futuras
COPY requirements.txt .

# Instala las dependencias
RUN pip install -r requirement.txt

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# Expone el puerto que usa Flask
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["python", "app.py"]