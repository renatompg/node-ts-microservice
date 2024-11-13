# Usando a imagem base do Node.js
FROM node:18

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json (ignorar lock se não existir)
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o código-fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor a porta 3000
EXPOSE 3000
EXPOSE 9229  

# Comando para rodar o aplicativo
CMD ["npm", "run", "start"]
#CMD ["node", "--inspect=0.0.0.0:9229", "dist/index.js"]
