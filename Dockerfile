# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

ARG PORT
ARG ENV
ARG JWT_SECRET

ENV PORT=$PORT \
    ENV=$ENV \
    JWT_SECRET=$JWT_SECRET

# Build the application
RUN npm run build

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/posts', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

EXPOSE $PORT

# Start the application
CMD ["npm", "start"]