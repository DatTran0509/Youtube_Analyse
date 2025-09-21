# filepath: /Users/dattran/Youtube_Analysis/Server/Dockerfile
FROM node:18-bullseye-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install yt-dlp and ffmpeg
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    ffmpeg && \
    pip3 install --upgrade yt-dlp

# Copy the rest of the application to the working directory
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]