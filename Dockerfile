FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY index.js ./
COPY src ./src

ENTRYPOINT ["node", "index.js"]