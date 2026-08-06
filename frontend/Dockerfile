# Build stage
FROM node:22-bookworm-slim AS builder
WORKDIR /app
ARG VITE_WHATSAPP_COMMUNITY_URL=""
ENV VITE_WHATSAPP_COMMUNITY_URL=$VITE_WHATSAPP_COMMUNITY_URL
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
