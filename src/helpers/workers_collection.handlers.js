const db = require('../models')

exports.createCollection = async function(req, res, next){
    try{
        //creating a collection
        let workers_collection = await db.Workers_collection.create({
            name: req.body.name,
            owner: req.params.id
        })
        //adding the id of the collection to the user
        let found_user = await db.User.findById(req.params.id);
        found_user.workers_collection.push(workers_collection.id)
        await found_user.save()   
        //retrieving information to be sent as response
        let found_collection = await db.Workers_collection.findById(workers_collection.id).populate('owner',{
            firstname: true,
            surname: true,
            id: true    
        })
        //returning a response 
        return res.status(200).json(found_collection)

    }catch(err){
        return next(err)
    }
}


module.exports = exports