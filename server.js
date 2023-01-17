/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////

const { Router } = require('express')
const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load ENV file's variables

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

// We're going to build a seed route
// this will seed the database for us with a few starter resources
// there are two ways we will talk about seeding the database
// First -> seed Router, they work but are not best practices
// Second -> seed script, they work and are best practices
app.get('/fruits/seed', (req, res) => {
    // array of starter resources (fruits)
    const startFruits = [
        { name: 'Orange', color: 'orange' , readyToEat: true },
        { name: 'Grape', color: 'purple' , readyToEat: true},
        { name: 'Banana', color: 'green', readyToEat: false },
        { name: 'Strawberry', color: 'red', readyToEat: false},
        { name: 'Coconut', color: 'brown', readyToEat: true}
    ]
    // then we delete every fruit in the database (all instaces of this resource)
    Fruit.deleteMany({})
        .then(() => {
            // then we'll seed(create) our starter fruits
            Fruit.create(startFruits)
                .then(data => {
                    res.json(data)
                })
                .catch(err => console.log('the following error occurred:', err))
        })
    
    // tell our db what to do with success and failures
    // console.log('the starter fruits', startFruits)
    // res.send({startFruits: startFruits})
})

// index route -> displays all fruits
app.get('/fruits', (req, res) => {
    // find all the fruits
    Fruit.find({})
        .then(fruits => { res.json({ fruits: fruits }) })
        // send json if successful
        .catch(err => console.log('the following error occurred:', err))
        // catch errors if they occur
})

/////////////////////////////////////////////////////
//// Server Listener                             ////
/////////////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))