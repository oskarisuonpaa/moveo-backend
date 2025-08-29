FROM node:22-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
RUN npm ls sqlite3 || echo "sqlite3 not installed"
COPY src ./src
RUN npm run build
EXPOSE 3000
CMD ["node", "-r", "tsconfig-paths/register", "dist/app.js"]