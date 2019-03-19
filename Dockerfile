FROM node:10.15.1-alpine

WORKDIR /server

COPY package.json .
COPY yarn.lock .

# Install production packages and remove cache folder straignt away
RUN yarn --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY src src

ENV NODE_ENV production
ENV PORT 3000

CMD [ "node", "." ]
