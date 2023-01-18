/////////////////////////////////////////////////////
//// Our schema and model for the fruit resource ////
/////////////////////////////////////////////////////
// old mongoose import
// const mongoose = require('mongoose')
// we want our mongoose object to relate to our db
// so we're going to bring in the mongoose connection from our utils
const mongoose = require('../utils/connection')
// destructure the schema & model functions from mongoose
const { Schema, model } = mongoose

//fruits schema
const fruitSchema = new Schema ({
    name: String, 
    color: String, 
    readyToEat: Boolean
})

const Fruit = model('Fruit', fruitSchema)


/////////////////////////////////////////////////////
//// Export model                                ////
/////////////////////////////////////////////////////
module.exports = Fruit