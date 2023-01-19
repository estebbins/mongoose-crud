/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const express = require('express') // import the express framework
// we don't need mongoose dependency in here anymore.
// const mongoose = require('mongoose') // import the mongoose library
// const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load ENV file's variables
const FruitRouter = require('./controllers/fruitControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const middleware = require('./utils/middleware')

/////////////////////////////////////////////////////
//// Create our Express App Object               ////
/////////////////////////////////////////////////////
// this was fine for building an API that sends and receives json
// const app = express()
// so we're utilizing an npm package liquid-express-views to add the 'view' layer to our MVC framework
// in short, we need to update our app ovject and tell it to use that package, as stated by the documentation
// calling express() as an argument for the function we get back from liquid express views
const app = require('liquid-express-views')(express())
// what liquid express views does for us is make it wasy to path our .liquid files(which will serve our HTML). this package says to look inside the views folder for files with the .liquid name.

/////////////////////////////////////////////////////
//// Middleware                                  ////
/////////////////////////////////////////////////////
// middleware runs before all the routes.
// our middleware is now processed by a function in the utils directory. This middleware function takes one argument, app, and processes requests through our middleware.
middleware(app)

/////////////////////////////////////////////////////
//// Routes                                      ////
/////////////////////////////////////////////////////
// This is the home route -> sends message confirming connection
app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})
// This is now where we register our routes, this is how server.js knows to send the correct response.
// app.use when we register our route needs two arguments
// the first arg is the base URL, second is the file to use
app.use('/fruits', FruitRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)

/////////////////////////////////////////////////////
//// Server Listener                             ////
/////////////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))