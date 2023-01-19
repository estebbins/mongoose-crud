/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

/////////////////////////////////////////////////////
//// Create Router                               ////
/////////////////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////////////
//// Routes                                      ////
/////////////////////////////////////////////////////
// GET -> /users/signup
// Renders a liquid page with the sign up form
router.get('/signup', (req, res) => {
    // res.render points to a file
    // res.redirect points to a URL
    res.render('users/signup')
})

// POST -> /users/signup
// This route creates new users in our db
router.post('/signup', async (req, res) => {
    // this route will take a req.body and use the data to create a user
    const newUser = req.body
    console.log('this is the req body', req.body)

    // we'll need to encrypt their password
    // this is where bcrypt comes into play
    // for the sake of bcrypt, we're going to use async
    // bcrypt hash is built into bcrypt lib, as well as .genSalt
    // bcrypt.hash is going to make a hash out of the password (string that only bcrypt can decrypt and compare)
    // genSalt tells bcrypt how many rounds of encryption to use (10)
    // it will create 10 hashes in a row. (10 is standard). Each round of salting adds an exponential layer to decrupt
    newUser.password = await bcrypt.hash(
        newUser.password, 
        await bcrypt.genSalt(10)
    )
    // res.json({ newUser: newUser })
    // then create the user
    User.create(newUser)
    // if we're successful, send a 201 status
        .then(user => {
            // console.log('new user created', user)
            // res.status(201).json({ username: user.username })
            // Makes sense to me to redirect to the login page
            res.redirect('/users/login')
        })
    // If there's an error, handle the error
        .catch(err => {
            console.log(err)
            // res.json(err)
            res.redirect(`/error?error=username%20taken`)
        })
})
// GET -> /users/login
// Renders a liquid
router.get('/login', (req, res) => {
    res.render('users/login')
})

// POST -> /users/login
// this route create new session in our db(and in the browser)
router.post('/login', async (req, res) => {
    // first, destructure username and password from our req.body
    const { username, password } = req.body
    // search the db, for a user with a specific username
    User.findOne({ username })
        .then(async (user) => {
            // we check if that use exists
            if (user) {
                // if they do, we compare the passwords using bcrypt
                // bcrypt.compare -> evaluates to a truthy or falsey value
                // we'll save the result to a variable for easy reference later
                // password -> comes from req.body
                // user.password -> is saved in the database
                const result = await bcrypt.compare(password, user.password)

                if (result) {
                    // if the passwords match, place the user's info in the session
                    // this is where we use that session object that lives in our request object
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id
                    // console.log('this is req.session \n', req.session)
                    // we'll send a 201 response and the user as son(for now)
                    // we'll update this after a couple tests to adhere to best practices
                    // res.status(201).json({ user: user.username })
                    res.redirect('/')
                } else {
                    // if the passwords don't match, send the user a message
                    // res.json({ error: 'username or password is incorrect' })
                    res.redirect(`/error?error=username%20or%20password%20is%20incorrect`)
                }
                

            } else {
                // if the user does not exist, we response with a message saying so
                // res.json({ error: 'user does not exist' })
                res.redirect(`/error?error=user%20does%20not%20exist`)
            }

        })
        .catch(err => {
            console.log(err)
            // res.json(err)
            res.redirect(`/error?error=${err}`)
        })

})
// GET -> /users/logout
// Renders page that allows users to log out
router.get('/logout', (req, res) => {
    res.render('users/logout')
})

// DELETE -> /users/logout
// This route destroys our session in our db(and in the browser)
router.delete('/logout', (req, res) => {
    // destroy the session and send an appropriate response
    req.session.destroy(err => {
        console.log('this is req.session upon logout \n', req.session)
        console.log('error on logout? \n', err)
        // eventually we will redirect users here, but that's after adding the view error.
        res.redirect('/')
    })
})


/////////////////////////////////////////////////////
//// Export Router                               ////
/////////////////////////////////////////////////////
module.exports = router