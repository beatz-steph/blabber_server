const db = require('../models')
const jwt = require('jsonwebtoken');

exports.signin = async function(req, res, next){
    try{
        let user = await db.User.findOne({
            email: req.body.email
        })
        
        if(!user) {
            next({
                status: 400,
                message: 'Email not found'
            })
        }

        let isMatch = await user.comparePassword(req.body.password)
        let {id, firstname, surname, photoURL, email, workers_collection} = user
        if(isMatch){
            let token = jwt.sign({
            id,
            firstname,
            surname,
            email,
            }, process.env.SECRET_KEY)

            return res.status(200).json({
                id,
                firstname,
                surname,
                workers_collection,
                token,
                photoURL 
            })
        }else{
            next({
                status: 400,
                message: 'Invalid email or password'
            })
        }
    }catch(err){
        return next(err)
    }
}

exports.signup = async function(req,res,next){
    try{
        let user = await db.User.create(req.body)
        let {id,firstname, surname, email,photoURL, workers_collection} = user

        let token = jwt.sign({
            id,
            firstname,
            surname,
            email,
        }, process.env.SECRET_KEY)

        return res.json({
            id,
            firstname,
            surname,
            token,
            photoURL,
            workers_collection
        })

    }catch(err){
        if(err.code === 11000) {
            err.message = "Sorry, that username and/or email is taken"
        }
        return next({
            status: 400,
            message: err.message
        })
    }
}

module.exports = exports