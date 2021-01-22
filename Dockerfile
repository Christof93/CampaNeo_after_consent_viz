FROM node:14.15.1-alpine as build

COPY SampleCampaign.json ./
COPY icons/ ./icons

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY */package-lock.json */package.json ./

RUN npm ci --silent

COPY campaign_network_d3/ ./

RUN npm run build


FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
