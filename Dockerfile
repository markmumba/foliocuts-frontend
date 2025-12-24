# -------- BUILD STAGE --------
  FROM node:20-alpine AS build

  WORKDIR /app
  
  # Copy dependency manifests first (for caching)
  COPY package.json package-lock.json ./
  
  # Install dependencies
  RUN npm ci
  
  # Copy source code
  COPY . .
  
  # Build-time environment variable (Vite)
  ARG VITE_API_BASE_URL
  ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
  
  # Build the application
  RUN npm run build
  
  
  # -------- RUNTIME STAGE --------
  FROM nginx:alpine
  
  # Remove default nginx config
  RUN rm /etc/nginx/conf.d/default.conf
  
  # Copy custom nginx config
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  # Copy built assets
  COPY --from=build /app/dist /usr/share/nginx/html
  
  # Ensure correct permissions
  RUN chown -R nginx:nginx /usr/share/nginx/html && \
      chmod -R 755 /usr/share/nginx/html
  
  USER nginx
  
  EXPOSE 80
  
  
  CMD ["nginx", "-g", "daemon off;"]
  