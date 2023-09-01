FROM node:18.17.1-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

CMD ["npm", "start"]

# Segunda etapa

FROM nginx:1.17.1-alpine

#* We must write the project name
COPY --from=build-step /app/dist/serverapp /usr/share/nginx/html