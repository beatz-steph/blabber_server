const db = require('../models');
const jwt = require('jsonwebtoken');

exports.patientSignin = async function(req, res, next) {
	try {
		let patient = await db.Patient.findOne({
			email: req.body.email,
		});

		if (!patient) {
			next({
				status: 400,
				message: 'Email not found',
			});
		}

		let isMatch = await patient.comparePassword(req.body.password);
		let { id, firstname, surname, email } = patient;
		if (isMatch) {
			let token = jwt.sign(
				{
					id,
					firstname,
					surname,
					email,
				},
				process.env.SECRET_KEY,
			);

			return res.status(200).json({
				patient: { id, email, firstname, surname },
				token,
			});
		} else {
			next({
				status: 400,
				message: 'Invalid email or password',
			});
		}
	} catch (err) {
		return next(err);
	}
};

exports.patientSignup = async function(req, res, next) {
	try {
		let patient = await db.Patient.create(req.body);
		let { id, firstname, surname, email } = patient;

		let token = jwt.sign(
			{
				id,
				firstname,
				surname,
				email,
			},
			process.env.SECRET_KEY,
		);

		return res.status(200).json({
			patient: { id, email, firstname, surname },
			token,
		});
	} catch (err) {
		if (err.code === 11000) {
			err.message = 'Sorry, that email is taken';
		}
		return next({
			status: 400,
			message: err.message,
		});
	}
};

exports.patientGetProfile = async function(req, res, next) {
	if (!req.headers.authorization) {
		return next({
			status: 401,
			message: 'Please log in',
		});
	}
	try {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
			if (decoded) {
				const retrieveInfo = async function() {
					try {
						let patient = await db.Patient.findById(decoded.id);
						let { id, email, firstname, surname } = patient;
						return res.status(200).json({
							patient: { id, email, firstname, surname },
						});
					} catch (err) {
						return next({
							status: 401,
							message: 'Account does not exist, sign up first',
						});
					}
				};
				retrieveInfo();
			} else {
				return next({
					status: 401,
					message: 'Account does not exist, sign up first',
				});
			}
		});
	} catch (err) {}
};

module.exports = exports;
