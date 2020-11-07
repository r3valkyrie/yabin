FROM node:lts as build
COPY . /yabin
WORKDIR /yabin
RUN yarn
RUN yarn build

FROM node:lts
RUN mkdir /app
WORKDIR /app

COPY --from=build /yabin/dist/ dist/
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY .env.docker .env

RUN yarn
ENTRYPOINT ["yarn", "start"]