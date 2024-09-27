# Etapa 1: Build da aplicação
FROM node:20.17.0-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json para instalar as dependências
COPY package*.json ./
COPY drizzle.config.ts ./
COPY .env ./
COPY src ./ 

# Instala dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Realiza o build da aplicação
RUN npm run build

# Etapa 2: Execução da aplicação
FROM node:20.17.0-alpine

WORKDIR /app

# Copia as dependências e arquivos da build da etapa anterior
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Copia package.json, drizzle.config.ts, o arquivo .env e o diretório src
# COPY package.json ./package.json
# COPY drizzle.config.ts ./drizzle.config.ts
# COPY .env ./.env
# COPY src ./src  # Certifica-se de que o diretório src seja copiado para a execução
COPY . .

# Expõe a porta usada pela aplicação
EXPOSE 5273

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
