# Etapa 1: Build da aplicação
FROM node:20.17.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Não execute db:migrate e db:seed aqui, remova essas linhas:
# RUN npm run db:generate
# RUN npm run db:migrate
# RUN npm run seed

# Etapa 2: Execução da aplicação
FROM node:20.17.0-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 5273

CMD ["/wait-for-it.sh", "pg_passin2:5432", "--", "npm", "run", "start"]
