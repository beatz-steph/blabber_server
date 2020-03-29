const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
	patient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Patient',
		required: true,
	},
	content: {
		type: String,
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

const EmergencyRequest = mongoose.model(
	'EmergencyRequest',
	emergencyRequestSchema,
);
module.exports = EmergencyRequest;
