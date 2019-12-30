const db = require('../models')


exports.createWorker = async function(req, res, next) {
    try{
        //create worker
        let {surname, firstname, salary, identification_number, role, start_date} = req.body
        let worker = await db.Worker.create({
            surname,
            firstname,
            salary,
            identification_number,
            role,
            start_date,
            employer: req.params.id,
            department: req.params.tag,
        })
        //adding id of worker to workrs collection
        let fetched_collection = await db.Workers_collection.findById(req.params.tag)
        fetched_collection.workers.push(worker.id)
        await fetched_collection.save()
        //retrieve information to be sent as response

        let fetched_worker = await db.Worker.findById(worker.id).populate('department', {
           name: true 
        })
        //send response

        return res.json(fetched_worker)
    }catch(err) {
        return next(err)
    }
}

exports.editWorker = async function(req, res, next){
    try{
        await db.Worker.findByIdAndUpdate(
            req.params.worker_id,
            req.body,
            {new: true},
            function(err, worker){
                if (err) return res.status(500).send(err);
                return res.json(worker)
            }
        )
        
    }catch(err){
        return next(err)
    }
}

exports.deleteWorker = async function(req,res,next){
    try{
        //find worker with a specific id
        let worker = await db.Worker.findById(req.params.worker_id)
        //delete worker from database 
        await worker.delete()
        //return a response
        return res.json({
            worker,
            message: 'Deleted'
        })
    }catch(err){
        return next(err)
    }
}

exports.retrieveSingleWorker = async function(req, res, next){
    try{
        let worker = await db.Worker.findById(req.params.worker_id)
        return res.json(worker)
    }catch(err){
        return next(err)
    }
}

module.exports = exports