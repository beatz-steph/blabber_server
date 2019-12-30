const express = require('express')
const router = express.Router({mergeParams: true});

const {createCollection, retrieveCollections, deleteCollection, retrieveACollection} = require('../helpers/workers_collection.handlers')
const {createWorker, editWorker, retrieveSingleWorker, deleteWorker} = require('../helpers/workers.handler')


//colection routes
router.route('/').post(createCollection).get(retrieveCollections)
router.route('/:tag').get(retrieveACollection).delete(deleteCollection)

//workers routes
router.route('/:tag/worker').post(createWorker)
router.route('/:tag/worker/:worker_id').put(editWorker).delete(deleteWorker).get(retrieveSingleWorker)



module.exports = router