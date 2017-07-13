# FerrisAcres ![Build Status](https://travis-ci.org/rickrizzo/FerrisAcres.svg?branch=develop)  
Finally a way to order your ice cream online!

## Watch / Build SCSS Automatically
`nodemon -e scss -x “npm run build-css”`

## Permission Errors?
Try this to get things working   
`chmod +x bin/watch-css`  
`chmod +x bin/build-css`

## Update Database
1. `heroku pg:psql --app creamery`
2. `psql \i init.sql`

