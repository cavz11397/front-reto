# Usar una imagen base oficial de Node.js para construir la aplicación
FROM node:14 AS build

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación Angular
RUN npm run build --prod

# Usar una imagen base de Nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos al directorio de Nginx
COPY --from=build /usr/src/app/dist/your-angular-app /usr/share/nginx/html

# Exponer el puerto en el que Nginx se ejecutará
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]