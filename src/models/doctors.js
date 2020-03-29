const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const doctorSchema = new mongoose.Schema({
	surname: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	yearOfGraduation: {
		type: String,
		required: true,
	},
	mdcn: {
		type: String,
		required: true,
	},
	timeAvailable: {
		type: Object,
	},
	daysAvailable: {
		type: Object,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		unique: true,
		required: true,
	},
	photoURL: {
		type: String,
	},
	drugRequest: [],
	emergencyRequest: [],
});

doctorSchema.pre('save', async function(next) {
	try {
		if (!this.isModified('password')) {
			return next();
		}
		let hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;
		return next();
	} catch (err) {
		return next(err);
	}
});

doctorSchema.methods.comparePassword = async function(recievedPassword, next) {
	try {
		let isMatch = await bcrypt.compare(recievedPassword, this.password);
		return isMatch;
	} catch (err) {
		return next(err);
	}
};
const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
