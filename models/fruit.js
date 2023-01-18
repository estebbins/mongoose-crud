/////////////////////////////////////////////////////
//// Our schema and model for the fruit resource ////
/////////////////////////////////////////////////////
const mongoose = require('mongoose')
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