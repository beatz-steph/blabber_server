const mongoose = require('mongoose')
const User = require('./user')

const workers_collection_Schema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
    },
    workers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    }],
    craeted_at : {
        type: Date,
        default: new Date()
    }
})

workers_collection_Schema.pre('remove' , async function(next){
    try{
        let user = await User.findById(this.owner)
        user.workers_collection.remove(this.id)
        await user.save()

        return next()
    }catch(err){
        return next(err)
    }
})

const Workers_collection = new mongoose.model('Workers_collection', workers_collection_Schema )
module.exports = Workers_collection