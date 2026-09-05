# Stage 1: Build React Frontend
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package descriptors and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files and build production dist
COPY . ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
