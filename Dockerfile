# Imagen base con Node.js
FROM node:18

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos archivos de la app
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto en el contenedor
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
