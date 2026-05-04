FROM node:18-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json và cài đặt thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Mở cổng 5000
EXPOSE 5000

# Chạy server
CMD ["node", "src/server.js"]
