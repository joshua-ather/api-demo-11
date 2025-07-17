FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies (bukan --production dulu, agar bisa build)
RUN npm install

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy all files
COPY . .

# Build project
RUN npm run build

# Install production-only deps (optional clean)
RUN npm prune --production

EXPOSE 3000
CMD ["node", "dist/main"]
