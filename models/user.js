/////////////////////////////////////////////////////
//// Our schema and model for the user resource  ////
/////////////////////////////////////////////////////
// bring in the mongoose connection from our utils
const mongoose = require('../utils/connection')
// destructure the schema & model functions from mongoose
const { Schema, model } = mongoose

/////////////////////////////////////////////////////
//// Define user schema & create user model      ////
/////////////////////////////////////////////////////
const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    }
})

const User = model('User', userSchema)

/////////////////////////////////////////////////////
//// Export model                                ////
/////////////////////////////////////////////////////
module.exports = User