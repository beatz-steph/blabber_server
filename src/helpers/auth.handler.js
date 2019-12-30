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
        let {id, firstname, surname, email, workers_collection} = user
        if(isMatch){
            let token = jwt.sign({
            id,
            firstname,
            surname,
            email,
            }, process.env.SECRET_KEY)

            return res.status(200).json({user:{id, email, firstname, surname, workers_collection},token})
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
        let {id,firstname, surname, email,workers_collection} = user

        let token = jwt.sign({
            id,
            firstname,
            surname,
            email,
        }, process.env.SECRET_KEY)

        return res.status(200).json({user:{id, email, firstname, surname, workers_collection},token})

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

exports.getProfile = async function(req, res, next){

    if(!req.headers.authorization){
        return next({
            status: 401,
            message: 'Please log in'
        })
    }
    try{
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err,decoded){
            if (decoded){
                const retrieveInfo = async function(){
                    try{
                        let user = await db.User.findById(decoded.id)
                        let {id, email, firstname, surname, workers_collection} = user
                        return res.status(200).json({user:{id, email, firstname, surname, workers_collection},token})
                    }catch(err){
                        return next({
                            status: 401,
                            message: 'Account does not exist, please log in first'
                        })
                    }
                }
                retrieveInfo()
            }else{
                return next({
                    status: 401,
                    message: 'Log in first'
                })
            }
        })
    }catch(err){

    }
}

module.exports = exports