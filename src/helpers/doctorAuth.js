const db = require('../models');
const jwt = require('jsonwebtoken');

exports.docSignin = async function(req, res, next) {
	try {
		let doctor = await db.Doctor.findOne({
			email: req.body.email,
		});

		if (!doctor) {
			next({
				status: 400,
				message: 'Email not found',
			});
		}

		let isMatch = await doctor.comparePassword(req.body.password);
		let { id, firstname, surname, email, mdcn } = doctor;
		if (isMatch) {
			let token = jwt.sign(
				{
					id,
					firstname,
					surname,
					email,
					mdcn,
				},
				process.env.SECRET_KEY,
			);

			return res.status(200).json({
				doctor: { id, email, firstname, surname },
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

exports.docSignup = async function(req, res, next) {
	try {
		let doctor = await db.Doctor.create(req.body);
		let { id, firstname, surname, email, mdcn } = doctor;

		let token = jwt.sign(
			{
				id,
				firstname,
				surname,
				email,
				mdcn,
			},
			process.env.SECRET_KEY,
		);

		return res.status(200).json({
			doctor: { id, email, firstname, surname },
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

exports.docGetProfile = async function(req, res, next) {
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
						let doctor = await db.Doctor.findById(decoded.id);
						let { id, email, firstname, surname } = doctor;
						return res.status(200).json({
							doctor: { id, email, firstname, surname },
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
