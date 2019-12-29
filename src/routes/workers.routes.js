const express = require('express')
const router = express.Router({mergeParams: true});

const {createCollection, retrieveCollections, deleteCollection, retrieveACollection} = require('../helpers/workers_collection.handlers')
const {createWorker} = require('../helpers/workers.handler')



router.route('/').post(createCollection).get(retrieveCollections)
router.route('/:tag/worker').post(createWorker)
router.route('/:tag').get(retrieveACollection).delete(deleteCollection)



module.exports = router