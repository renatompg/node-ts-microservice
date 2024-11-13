FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 9229  

CMD ["npm", "run", "start"]
