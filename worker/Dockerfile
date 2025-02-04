FROM ubuntu:22.04

# Install required dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    ca-certificates \
    curl \
    xz-utils  # <-- Install xz-utils to handle .tar.xz files

# Manually download and install Node.js 20.18.0
WORKDIR /tmp
RUN curl -fsSLO "https://nodejs.org/dist/v20.18.0/node-v20.18.0-linux-x64.tar.xz" \
    && tar -xJf "node-v20.18.0-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
    && rm "node-v20.18.0-linux-x64.tar.xz"

# Verify installation
RUN node -v && npm -v

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]
