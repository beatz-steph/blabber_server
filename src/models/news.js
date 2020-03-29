const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const newsSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	writer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Doctor',
		required: true,
	},
});

const News = mongoose.model('News', newsSchema);
module.exports = News;
