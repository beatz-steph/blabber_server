const express = require('express');
const router = express.Router();

const db = require('../models');

const {
	docGetProfile,
	docSignin,
	docSignup,
} = require('../helpers/doctorAuth');

const {
	patientGetProfile,
	patientSignin,
	patientSignup,
} = require('../helpers/patientAuth');

//doctor auth routes

router.post('/doctor/signup', docSignup);
router.post('/doctor/signin', docSignin);
router.get('/doctor', docGetProfile);

//patinet auth route

router.post('/patient/signup', patientSignup);
router.post('/patient/signin', patientSignin);
router.get('/patient', patientGetProfile);

module.exports = router;
