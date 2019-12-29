const mongoose = require('mongoose');
const Workers_collection = require('./workers_collection')
const User = require('./user')

const workerSchema = new mongoose.Schema({
    surname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    identification_number: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workers_collection'
    }

})

workerSchema.pre('remove', async function(next){
    try{
        let workers_collection = await Workers_collection.findById(this.department)
        workers_collection.workers.remove(this.id)
        await workers_collection.save()
        return next()
    }catch(err){
        return next(err)
    }
})

const Worker = new mongoose.model('Worker', workerSchema)

module.exports = Worker