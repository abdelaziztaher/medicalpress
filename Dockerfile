# Use Node.js LTS version
FROM node:20-slim

# Install Chrome and dependencies for article generator
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    curl \
    unzip \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY blog-site/package*.json ./blog-site/
COPY fixedArticleGenerator/package*.json ./fixedArticleGenerator/

# Install dependencies
RUN cd blog-site && npm install
RUN cd fixedArticleGenerator && npm install

# Copy source code
COPY blog-site ./blog-site
COPY fixedArticleGenerator ./fixedArticleGenerator
COPY run-all.js ./

# Create necessary directories
RUN mkdir -p /app/articles
RUN mkdir -p /app/blog-site/public/articles

# Set environment variables
ENV NODE_ENV=production
ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROME_PATH=/usr/bin/google-chrome

# Expose port for Next.js
EXPOSE 3000

# Start command
CMD ["node", "run-all.js"]
