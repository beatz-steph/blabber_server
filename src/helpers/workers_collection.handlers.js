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

exports.retrieveCollections = async function(req, res, next){
    try{
        //filter through collections db to find those whose owners correspond with the request parameters and populate workrs information
        let collections = await db.Workers_collection.find({
            owner: req.params.id
        }).populate('workers', {
            surname: true,
            firstname: true,
            role: true,
        })
        //return the collection
        return res.json(collections)
    }catch(err){
        return next(err)
    }
}

exports.deleteCollection = async function(req, res, next){
    try{
    //find particular collection based on id
    let collection = await db.Workers_collection.findById(req.params.tag)
    //call remove function on the collection 
    await collection.remove()
    //return response about collection deleted}
    return res.json(collection)

    }catch(err){
        return next(err)
    }
}

exports.retrieveACollection = async function(req, res, next){
    try{
        //find collection
        let collection = await db.Workers_collection.findById(req.params.tag).populate('workers', {
            surname: true,
            firstname: true,
            salary: true,
            identification_number: true,
            role: true,
            start_date: true,
        })
        //populate necessary information about workers and ownner 
        //return response
        return res.json(collection)
    }catch(err){
        return next(err)
    }
}

module.exports = exports