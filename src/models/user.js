const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    surname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    photoURL: {
        type: String
    },
    workers_collection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workers_collection'
    }]
})

userSchema.pre('save', async function(next){
    try{
        if(!this.isModified('password')){
            return next()
        }
        let hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
        return next()
    }catch(err) {
        return next(err)
    }
})

userSchema.methods.comparePassword = async function(recievedPassword, next){
    try{
        let isMatch = await bcrypt.compare(recievedPassword,this.password)
        return isMatch
    }catch(err) {
        return next(err)
    }
}
const User = mongoose.model('User', userSchema)
module.exports = User