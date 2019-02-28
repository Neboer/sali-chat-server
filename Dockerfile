FROM node
COPY . /usr/src/sali-chat
WORKDIR /usr/src/sali-chat
RUN yarn && npm install typescript -g
RUN tsc
CMD node server.js