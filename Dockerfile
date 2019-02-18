FROM node
COPY . /usr/src/sali-chat
WORKDIR /usr/src/sali-chat
RUN npm install && npm install typescript -g
RUN tsc
CMD node server.js