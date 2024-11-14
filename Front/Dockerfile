# Usa una imagen base de Node.js para construir la aplicación
FROM node:16 AS build

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Usa una imagen base de Nginx para servir la aplicación
FROM nginx:stable-alpine

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos compilados al directorio predeterminado de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]