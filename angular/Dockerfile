# Use Node.js for building the Angular app
FROM node:20.18.0 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Use Nginx for serving the built Angular app
FROM nginx:alpine
COPY --from=builder /app/dist/angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
