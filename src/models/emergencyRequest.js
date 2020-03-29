const mongoose = require('mongoose');

const drugRequestSchema = new mongoose.Schema({
	patient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Patient',
		required: true,
	},
	typeOfEmergency: {
		type: String,
		required: true,
	},
	doctor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Doctor',
		required: true,
	},
	status: {
		type: String,
		default: 'pending',
	},
});

const DrugRequest = mongoose.model('DrugRequest', drugRequestSchema);
module.exports = DrugRequest;
