const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/medicare', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
module.exports.Doctor = require('./doctors');
module.exports.Patient = require('./patients');
module.exports.News = require('./news');
module.exports.Drugrequest = require('./drugRequest');
module.exports.EmergencyRequest = require('./emergencyRequest');
