FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Install a simple static server
RUN npm install -g serve

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "5173"]