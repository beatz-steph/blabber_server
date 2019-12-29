const express = require('express')
const router = express.Router({mergeParams: true});

const {createCollection} = require('../helpers/workers_collection.handlers')
const {createWorker} = require('../helpers/workers.handler')


router.route('/').post(createCollection)
router.route('/:tag/worker').post(createWorker)



module.exports = router