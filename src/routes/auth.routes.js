const express = require('express');
const router = express.Router();

const db = require('../models');

const { getProfile, docSignin, docSignup } = require('../helpers/doctorAuth');

const {
	patientGetProfile,
	patientSignin,
	patientSignup,
} = require('../helpers/patientAuth');

//doctor auth routes

router.post('/doctor/signup', docSignup);
router.post('/doctor/signin', docSignin);
router.get('/', getProfile);

//patinet auth route

router.post('/patient/signup', patientSignup);
router.post('/patient/signin', patientSignin);

module.exports = router;
