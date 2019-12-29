const mongoose = require('mongoose')
mongoose.set('debug', true)
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/blabber', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

module.exports.User = require('./user')
module.exports.Workers_collection = require('./workers_collection')
module.exports.Worker = require('./worker')