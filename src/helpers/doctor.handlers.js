const db = require('../models');

exports.createNews = async function(req, res, next) {
	try {
		//creating a collection
		let news = await db.News.create({
			title: req.body.title,
			content: req.body.content,
			writer: req.params.id,
		});

		//retrieving information to be sent as response
		let fetched_news = await db.News.findById(news.id).populate('writer', {
			firstname: true,
			surname: true,
		});
		//returning a response
		return res.status(200).json(fetched_news);
	} catch (err) {
		return next(err);
	}
};

exports.retrieveNews = async function(req, res, next) {
	try {
		//filter through collections db to find those whose owners correspond with the request parameters and populate workrs information
		let collections = await db.News.find().populate('writer', {
			surname: true,
			firstname: true,
		});
		//return the collection
		return res.json(collections);
	} catch (err) {
		return next(err);
	}
};

exports.deleteNews = async function(req, res, next) {
	try {
		//find particular collection based on id
		let collection = await db.News.findById(req.params.newsId);
		//call remove function on the collection
		await collection.remove();
		//return response about collection deleted}
		return res.json(collection);
	} catch (err) {
		return next(err);
	}
};

exports.createDrugRequest = async function(req, res, next) {
	try {
		let Request = await db.Drugrequest.create({
			patient: req.params.patientId,
			content: req.body.content,
			doctor: req.params.id,
		});
		//add to doctors request history
		let prescribingDoctor = await db.Doctor.findById(req.params.id);

		prescribingDoctor.drugRequest.push(Request.id);

		prescribingDoctor.save();

		//retrieving drug request
		let response = await db.Drugrequest.findById(Request.id).populate(
			'patient',
			{
				surname: true,
				firstname: true,
			},
		);

		return res.status(200).json(response);
	} catch (err) {
		return next(err);
	}
};

exports.cancelDrugRequest = async function(req, res, next) {
	try {
		// aparticular drug request by id
		let drugRequest = await db.Drugrequest.findById(req.params.drugId);
		//delete drug request from drug request database
		await drugRequest.set('status', 'cancelled').save();
		//change state of a particular
		return res.status(200).json(drugRequest);
	} catch (err) {
		return next(err);
	}
};

exports.confirmDrugRequest = async function(req, res, next) {
	try {
		// aparticular drug request by id
		let drugRequest = await db.Drugrequest.findById(req.params.drugId);
		//delete drug request from drug request database
		await drugRequest.set('status', 'confirmed').save();
		//change state of a particular
		return res.status(200).json(drugRequest);
	} catch (err) {
		return next(err);
	}
};
exports.createEmergencyRequest = async function(req, res, next) {
	try {
		let Request = await db.EmergencyRequest.create({
			patient: req.params.patientId,
			typeOfEmergency: req.body.content,
			doctor: req.params.id,
		});
		//add to doctors request history
		let prescribingDoctor = await db.Doctor.findById(req.params.id);

		prescribingDoctor.emergencyRequest.push(Request.id);

		prescribingDoctor.save();

		//retrieving drug request
		let response = await db.EmergencyRequest.findById(Request.id).populate(
			'patient',
			{
				surname: true,
				firstname: true,
			},
		);

		return res.status(200).json(response);
	} catch (err) {
		return next(err);
	}
};

exports.cancelEmergencyRequest = async function(req, res, next) {
	try {
		// aparticular drug request by id
		let emergencyRequest = await db.EmergencyRequest.findById(
			req.params.emergencyId,
		);
		//delete emergency request from emergency request database
		await emergencyRequest.set('status', 'cancelled').save();
		//change state of a particular
		return res.status(200).json(emergencyRequest);
	} catch (err) {
		return next(err);
	}
};

exports.confirmEmergencyRequest = async function(req, res, next) {
	try {
		// aparticular drug request by id
		let emergencyRequest = await db.EmergencyRequest.findById(
			req.params.emergencyId,
		);
		//delete emergency request from emergency request database
		await emergencyRequest.set('status', 'confirmed').save();
		//change state of a particular
		return res.status(200).json(emergencyRequest);
	} catch (err) {
		return next(err);
	}
};
module.exports = exports;
