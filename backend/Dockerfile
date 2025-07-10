FROM node:20
WORKDIR /app

# Only copy package files first for better caching
COPY package*.json ./
RUN npm install

# Now copy the rest of the code
COPY . .

CMD ["npm", "run", "server"]