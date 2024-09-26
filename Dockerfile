# Etapa 1: Build da aplicação
FROM node:20.17.0-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Build da aplicação
RUN npm run build

# Gera o Drizzle ORM
RUN npm run db:generate

# Executa a migração do banco de dados
RUN npm run db:migrate

# Faz o seeding do banco de dados
RUN npm run seed

# Etapa 2: Execução da aplicação
FROM node:20.17.0-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários do build anterior
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expor a porta usada pelo Fastify
EXPOSE 5273

# Comando para rodar a aplicação
CMD ["npm", "run", "start"]
