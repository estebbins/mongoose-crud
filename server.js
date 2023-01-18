/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const express = require('express') // import the express framework
// we don't need mongoose dependency in here anymore.
// const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load ENV file's variables
const FruitRouter = require('./controllers/fruitControllers')

/////////////////////////////////////////////////////
//// Create our Express App Object               ////
/////////////////////////////////////////////////////

const app = express()

// Middleware //
// middleware runs before all the routes
app.use(morgan('tiny')) //this is for request logging, the tiny argument delcares what size of morgan log to use

app.use(express.urlencoded({ extended: true })) //this parses url encoded request bodies (useful for post and put requests)
app.use(express.static('public')) //this serves static files from the public folder
app.use(express.json()) //parses incoming requestt payloads with json

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

/////////////////////////////////////////////////////
//// Server Listener                             ////
/////////////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))