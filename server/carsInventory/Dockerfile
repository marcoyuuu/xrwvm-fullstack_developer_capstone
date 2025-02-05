# carsInventory/Dockerfile

FROM node:18.12.1-bullseye-slim

RUN npm install -g npm@9.1.3

# Copy package.json and app.js
ADD package.json .
ADD app.js .

# Copy the inventory model and data folder (including car_records.json)
ADD inventory.js .
ADD data/car_records.json ./data/car_records.json

# Copy remaining files (if any)
COPY . .

RUN npm install

EXPOSE 3050

CMD [ "node", "app.js" ]
