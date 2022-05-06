FROM node:14

RUN mkdir /nextjs

WORKDIR /nextjs

COPY ./package.json /nextjs

RUN yarn install

COPY . /nextjs

RUN yarn run build

CMD [ "yarn", "start" ]