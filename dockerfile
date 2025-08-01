# Multi-stage build para mejor rendimiento
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar y instalar dependencias
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copiar código y construir
COPY . .
RUN cd frontend && npm run build

# Imagen de producción
FROM node:18-alpine AS production

WORKDIR /app

# Copiar solo lo necesario
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["sh", "-c", "cd backend && npm start"]
