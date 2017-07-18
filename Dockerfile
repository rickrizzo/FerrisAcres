FROM node:boron

# Create directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 3000
CMD ["npm", "start"]