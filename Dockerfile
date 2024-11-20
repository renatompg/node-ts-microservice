# Use uma imagem oficial do Node.js como base
FROM node:18

# Crie um diretório para o seu aplicativo no contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho no contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código-fonte para o contêiner
COPY . .

# Instale o TypeScript globalmente (se necessário)
RUN npm install -g typescript

# Compile o código TypeScript
RUN tsc

# Exponha a porta necessária
EXPOSE 3000

# Inicie o servidor
CMD ["node", "dist/index.js"]
