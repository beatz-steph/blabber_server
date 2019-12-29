//importing environment config
require('dotenv').config()

const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser')
//helper functions
const errorHandler = require('./src/helpers/error-handler.helpers')
//initializing the app
const app = express()
const PORT = process.env.PORT || 8081

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

//additional middlewares

const {loginRequired, authorizationRequired} = require('./src/middleware/auth.middleware')

//sub-route handling fnctions
const auth_routes = require('./src/routes/auth.routes')
const workers_routes = require('./src/routes/workers.routes')



//all routes handling

app.use('/api/v1/auth', auth_routes)
app.use('/api/v1/user/:id/workers_collection',loginRequired, authorizationRequired, workers_routes)


app.use(function(req, res, next) {
    let err = new Error('Not found');
    err.status = 404
    next(err)
})

app.use(errorHandler)

app.listen(PORT, function() {
    console.log(`listen on port ${PORT}`)
})