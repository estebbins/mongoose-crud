/////////////////////////////////////////////////////
//// Import Dependencies                         ////
/////////////////////////////////////////////////////
const mongoose = require('../utils/connection') // import the mongoose library
const Fruit = require('./fruit')

// Here we'll add our seed script
// This will seed our database for us, just like our seed route did
// the difference is, only an 'administrative' type of user can run this script
// this script will eventually be run with the command `npm run seed`

////////// This is our old seed route /////////////////
// We're going to build a seed route
// this will seed the database for us with a few starter resources
// there are two ways we will talk about seeding the database
// First -> seed Router, they work but are not best practices
// Second -> seed script, they work and are best practices
// router.get('/seed', (req, res) => {
//     // array of starter resources (fruits)
//     const startFruits = [
//         { name: 'Orange', color: 'orange' , readyToEat: true },
//         { name: 'Grape', color: 'purple' , readyToEat: true},
//         { name: 'Banana', color: 'green', readyToEat: false },
//         { name: 'Strawberry', color: 'red', readyToEat: false},
//         { name: 'Coconut', color: 'brown', readyToEat: true}
//     ]
//     // then we delete every fruit in the database (all instaces of this resource)
//     Fruit.deleteMany({})
//         .then(() => {
//             // then we'll seed(create) our starter fruits
//             Fruit.create(startFruits)
//                 .then(data => {
//                     res.json(data)
//                 })
//                 .catch(err => console.log('the following error occurred:', err))
//         })
    
//     // tell our db what to do with success and failures
//     // console.log('the starter fruits', startFruits)
//     // res.send({startFruits: startFruits})
// })
/////////////////////////////////////////////////////
//// Seed Script Code                            ////
/////////////////////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection

db.on('open', () => {
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
            // tell our app what to do with success and failures
                .then(data => {
                    console.log('here are the created fruits: \n', data)
                    db.close()
                })
                .catch(err => {
                    console.log('the following error occurred:', err)
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            // always make sure to close the connection
            db.close()
        })
})

