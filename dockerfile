FROM node:14-alpine3.12

# set working directory
WORKDIR /app

COPY . .

RUN yarn global add pm2

# install app dependencies
ADD package.json yarn.lock ./
RUN yarn --silent --ignore-optional --prod

EXPOSE 8080

CMD ["pm2-runtime" , "start" , "ecosystem.config.js"]



