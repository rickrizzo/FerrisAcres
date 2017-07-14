# FerrisAcres ![Build Status](https://travis-ci.org/rickrizzo/FerrisAcres.svg?branch=develop)  
Finally a way to order your ice cream online from Ferris Acres Creamery!

## Start Project
Before deploying this project be sure to create your own `private.key` file! The one inclduded here is hardly secure and only for testing purposes on your local machine.  Once you've done this and installed all of the dependencies (`npm install`) do the following:

Without nodemon : `npm start`  
With nodemon: `nodemon`  

## Watch / Build SCSS Automatically
This project uses `node-sass` to build the SASS components. There are also scripts included to build this automatically. Simply execute `npm run watch-css`.
#### Permission Errors?
Try this to get things working for the build scripts   
`chmod +x bin/watch-css`  
`chmod +x bin/build-css`

## Update Hosted Database
1. `heroku pg:psql --app creamery`
2. `psql \i init.sql`

## Deploy on Docker
`docker build -t robrusso/ferris-acres .`  
`docker run -p 80:3000 -e "DATABASE_URL=secret_db_url" robrusso/ferris-acres`
