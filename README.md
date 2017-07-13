# FerrisAcres ![Build Status](https://travis-ci.org/rickrizzo/FerrisAcres.svg?branch=develop)  
Finally a way to order your ice cream online from Ferris Acres Creamery!

## Start Project
`nodemon`
This will build the SASS and start the server

## Watch / Build SCSS Automatically
`npm run watch-css`
#### Permission Errors?
Try this to get things working for the build scripts   
`chmod +x bin/watch-css`  
`chmod +x bin/build-css`

## Update Database
1. `heroku pg:psql --app creamery`
2. `psql \i init.sql`

