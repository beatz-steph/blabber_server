const express = require('express')
const router = express.Router()

const db = require('../models')

const {signin, signup} = require('../helpers/auth.handler')

router.post('/signup', signup )
router.post('/signin', signin)

module.exports = router