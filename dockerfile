FROM node:14-alpine3.12 as builder

# set working directory
WORKDIR /home/app

COPY . .

# install app dependencies
COPY package.json yarn.lock ./
RUN yarn --silent --ignore-optional --prod 

RUN yarn run build

FROM node:14-alpine3.12 as prod

WORKDIR /home/app
COPY --from=builder /home/app/build ./
EXPOSE 8080

CMD ["npx","serve -p 8080 -s build"]




