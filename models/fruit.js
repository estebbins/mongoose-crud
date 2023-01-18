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

/////////////////////////////////////////////////////
//// Define fruit schema & create fruit model    ////
/////////////////////////////////////////////////////
const fruitSchema = new Schema ({
    name: {
        type: String
    }, 
    color: {
        type: String
    }, 
    readyToEat: {
        type: Boolean
    },
    owner: {
        // this is where we set up an objectId reference
        // by declaring that as a type
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Fruit = model('Fruit', fruitSchema)


/////////////////////////////////////////////////////
//// Export model                                ////
/////////////////////////////////////////////////////
module.exports = Fruit