/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger
const session = require('express-session') // import the express-session package
const MongoStore = require('connect-mongo') // import the connect-mongo package (for sessions)
require('dotenv').config() // connect-mongo needs to be able to connect to our database.
const methodOverride = require('method-override')

/////////////////////////////////////////////////////
//// Middleware function                         ////
/////////////////////////////////////////////////////
// Now, instead of processing our middleware in server.js, we're going to buiod a function that will take the entire app as an argument, and run requests through all our middleware
const middleware = (app) => {
    // middleware runs before all the routes
    // methodOverride is middleware that allows us to utilize forms to their full potential.
    // by default, forms can ONLY send a GET or a POST request.
    // method-override allows us to send PUT/PATCH, DELETE, and other requests from a form, by defining it with '_method'
    app.use(methodOverride('_method'))
    app.use(morgan('tiny')) //this is for request logging, the tiny argument delcares what size of morgan log to use

    app.use(express.urlencoded({ extended: true })) //this parses url encoded request bodies (useful for post and put requests)
    // using express.static('public') allows us to serve a single CSS stylesheet across our application where we want to.
    app.use(express.static('public')) //this serves static files from the public folder
    app.use(express.json()) //parses incoming requestt payloads with json
    // here, we set up and utilize a session function, and we pass that function a config argument, to configure our session in the way we want. This argument will tell express-session how to crfeate and store our session.
    // The config object, needs several keys in order to work (see expess-session docs)
    // they keys are:
    // secret - a super top secret code, that allows from the create of a session
    // this secret is kinda like authorizaation, that allows out app to create with connectMongo
    // store -> tells connec-mongo where to save the session (our db)
    // then two options" saveUninitialized(set to true) and resave (set to false)
    app.use(
        session({
            secret: process.env.SECRET,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL
            }),
            // Using true while we're developing, but false is best practice
            saveUninitialized: true,
            resave: false
        })
    )
}
/////////////////////////////////////////////////////
//// Export middleware function                  ////
/////////////////////////////////////////////////////
module.exports = middleware