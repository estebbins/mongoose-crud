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

// Create route
// Create -> receives a request body, and creates a new document in the database
app.post('/fruits', (req, res) => {
    // here, we'll have a request body
    // Inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    const newFruit = req.body
    Fruit.create(newFruit)
        // send a 201 status, along with the json response of the new fruit
        .then(fruit => {
            res.status(201).json({ fruit: fruit.toObject() })
        })
        // send and error if one occurs
        .catch(err => console.log(err))
    // res.send(newFruit) //to essentially console log to postman
})

// PUT route
// Update -> updates a specific fruit
// PUT replaces the entire document with a new document from the req.body
// PATCH is able o tupdate specific fields at specific times, but it requires a little more code to ensure that it works properly, so we'll yuse that later.
app.put('/fruits/:id', (req, res) => {
    // save the id to a variable for easy use later
    const id = req.params.id
    // save the request body to a variable for easy reference later
    const updatedFruit = req.body
    // we're going to use the mongoose method:
    // findByIdAndUpdate
    // Eventually we'll change how tthis route works, but for now, we'll do everything in one shot, with findByIdAndUpdate
    Fruit.findByIdAndUpdate(id, updatedFruit, { new: true })
        .then(fruit => {
            console.log('the newly updated fruit', fruit)
            // update success message will be a 204 - no content
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})


// DELETE route
// Delete -> delte a specific fruit
app.delete('/fruits/:id', (req, res) => {
    // get the id from the req
    const id = req.params.id
    // Find and delete fruit
    Fruit.findByIdAndDelete(id)
    // send 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// SHOW route
// Read -> finds and displays a single resource
app.get('/fruits/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that Id
    Fruit.findById(id)
        .then(fruit => {
            res.json({ fruit: fruit })
        })
        .catch(err => console.log(err))
    // send the fruit as json upon success
    // catch any errors

})

/////////////////////////////////////////////////////
//// Server Listener                             ////
/////////////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))