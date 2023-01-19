/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const express = require('express')
const Fruit = require('../models/fruit')

/////////////////////////////////////////////////////
//// Create Router                               ////
/////////////////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////////////
//// Routes                                      ////
/////////////////////////////////////////////////////
// Subdocuments are not mongoose models. That means they don't have their own collection, they don't come with the same model methods that we're used to (they have some their own built in)
// this also means, that a subdoc is never going to be viewed without it's parent document. We'll never see a comment without seeing the fruit it was commented on first.

// This also means, that when we make a subdocumrnt, we must MUST refer to the parent so that mongoose knows where in mongodb to store this subdocument.

// POST
// only loggedin users can post comments
// bc we have to refer to a fruit, we'll do that in the simplest way via the route
router.post('/:fruitId', (req, res) => {
    // first we get the fruit ID and save to a variable
    const fruitId = req.params.fruitId
    // then we'll protect this route against non-logged-in users
    if (req.session.loggedIn) {
        // if logged in, make the logged in user the author of the comment
        // this is exactly like how we added the owner to our fruits
        req.body.author = req.session.userId
        const theComment = req.body
        // find a sepcific fruit
        Fruit.findById(fruitId)
        // response with a 201 and the fruit itself
            .then(fruit => {
                // create the comment (with a req.body)
                fruit.comments.push(theComment)
                // save the fruit
                return fruit.save()
            })
            .then(fruit => {
                res.status(201).json({ fruit: fruit })
            })
            // catch and handle any errors 
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    } else {
        res.sendStatus(401) // send a 401-unauthorized
    }

})

// DELETE -> /comments/delete/<someFriutId>/<someCommentId>
// make sure only the author of the comment can delete the comment
router.delete('/delete/:fruitId/:commId', (req, res) => {
    // isolete the ids and save to variables so we don't have to keep typing req.params
    // const fruitId = req.params.fruitId
    // const commId = req.params.commId
    const { fruitId, commId } = req.params

    Fruit.findById(fruitId)
        .then(fruit => {
            // get comment, we'll use the build in subdoc method called .id()
            const theComment = fruit.comments.id(commId)
            console.log('this is the comment to be delete: \n', theComment)
            // then we want to make sure the user is logged in, and that they are the author of the comment.
            if (req.session.loggedIn) {
                // if they are, allow them to delete
                if (theComment.author == req.session.userId) {
                    // we can use another built in method, remove()
                    theComment.remove()
                    fruit.save()
                    res.sendStatus(204) //send 204 no content
                } else {
                    res.sendStatus(401) // send a 401-unauthorized
                }
            } else{
            // otherwise, send a 401 unauthorized status
                res.sendStatus(401)
            }
            
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })

})

/////////////////////////////////////////////////////
//// Export Router                               ////
/////////////////////////////////////////////////////
module.exports = router