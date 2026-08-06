# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_WHATSAPP_COMMUNITY_URL=""
ENV VITE_WHATSAPP_COMMUNITY_URL=$VITE_WHATSAPP_COMMUNITY_URL
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx vite build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
