/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger

/////////////////////////////////////////////////////
//// Middleware function                         ////
/////////////////////////////////////////////////////
// Now, instead of processing our middleware in server.js, we're going to buiod a function that will take the entire app as an argument, and run requests through all our middleware
const middleware = (app) => {
    // middleware runs before all the routes
    app.use(morgan('tiny')) //this is for request logging, the tiny argument delcares what size of morgan log to use

    app.use(express.urlencoded({ extended: true })) //this parses url encoded request bodies (useful for post and put requests)
    app.use(express.static('public')) //this serves static files from the public folder
    app.use(express.json()) //parses incoming requestt payloads with json
}
/////////////////////////////////////////////////////
//// Export middleware function                  ////
/////////////////////////////////////////////////////
module.exports = middleware