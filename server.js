/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load ENV file's variables
const FruitRouter = require('./controllers/fruitControllers')

/////////////////////////////////////////////////////
//// Import Models                               ////
/////////////////////////////////////////////////////
const Fruit = require('./models/fruit')

/////////////////////////////////////////////////////
//// Database Connection                         ////
/////////////////////////////////////////////////////
// This is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL
// Here is our db config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// establish our database connection
mongoose.connect(DATABASE_URL, CONFIG)

// Tell mongoose what to do with certain events
// What happens when we open, disconnect, or get an error
mongoose.connection
    .on('open', () => console.log('Connected to Mongoose'))
    .on('close', () => console.log('disconnected from Mongoose'))
    .on('error', (err) => console.log('An error occurred: \n', err))


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