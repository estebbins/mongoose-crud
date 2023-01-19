/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const mongoose = require ('../utils/connection')

/////////////////////////////////////////////////////
//// Our Schema for the comment subdocument      ////
/////////////////////////////////////////////////////
// All we need from mongoose, to build subdocuments 
// Is the schema constructor
// SUBDOCS ARE NOT MODELS
// We'll destructure the schema function from mongoose
const { Schema } = mongoose

// comment schema
const CommentSchema = new Schema ({
    note: {
        type: String, 
        required: true
    }, 
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    }
}, {
    timestamps: true
})

// Take note that there is no model function happening anywhere in this file. That's because SUBDOCS ARE NOT MONGOOSE MODELS

/////////////////////////////////////////////////////
//// Export our schema                               ////
/////////////////////////////////////////////////////
module.exports = CommentSchema