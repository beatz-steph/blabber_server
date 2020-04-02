//importing environment config
require('dotenv').config();

const http = require('http');

const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const socketio = require('socket.io');
//helper functions
const errorHandler = require('./src/helpers/error-handler.helpers');

const moment = require('moment');

const msgFormatter = (details, message, profession) => {
	return {
		details,
		message,
		profession,
		time: moment().format('h:mm a'),
	};
};
//initializing the app
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const patients = [];
const doctors = [];

io.on('connection', socket => {
	let index;
	let profession;
	// socket.emit('message', { text: 'Welcome mutherfucker' });

	socket.on('patientOnline', ({ details }) => {
		patients.push({ socket, details: details });
		profession = 'patient';
		console.log(patients);
		console.log(doctors);

		socket.emit(
			'message',
			msgFormatter(
				details,
				`welcome ${details.firstname} ${details.surname}`,
				'doctor',
			),
		);
	});

	socket.on('patientMessage', ({ message, details }) => {
		socket.broadcast
			.to('doctor')
			.emit('message', msgFormatter(details, message, 'patient'));
		socket.emit('message', msgFormatter(details, message, 'patient'));
	});

	socket.on('doctorMessage', ({ message, to }) => {
		//find a specific online user
		let index = patients.findIndex(user => user.details.id === to);
		//send mesage to user
		if (index === -1) {
			return;
		}
		patients[index].socket.emit(
			'message',
			msgFormatter('doctor', message, 'doctor'),
		);
		//send message to doctor
		socket.join('doctor');
		socket.emit(
			'message',
			msgFormatter(patients[index].details, message, 'doctor'),
		);
		console.log('ok');
	});

	socket.on('doctorOnline', ({ details }) => {
		doctors.push({ socket, details: details });
		profession = 'doctor';
		console.log(patients);
		console.log(doctors);

		socket.join('doctor');

		socket.emit(
			'message',
			msgFormatter(details, `welcome doctor ${details.firstname}`, 'doctor'),
		);
	});

	socket.on('disconnect', () => {
		profession === 'patient'
			? patients.splice(index)[0]
			: doctors.splice(index)[0];

		console.log(`${profession} disconexted`);
	});
});

const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//additional middlewares

const {
	loginRequired,
	authorizationRequired,
	doctorRequired,
} = require('./src/middleware/auth.middleware');

//sub-route handling fnctions
const auth_routes = require('./src/routes/auth.routes');
const doctors_routes = require('./src/routes/doctor.routes');
// const patients_routes = require('./src/routes/patients.routes');

//news retrieving functon
const { retrieveNews } = require('./src/helpers/doctor.handlers');

//all routes handling

app.use('/api/v1/auth', auth_routes);
app.use(
	'/api/v1/patient/:id',
	loginRequired,
	authorizationRequired,
	// patients_routes,
);
app.use(
	'/api/v1/doctor/:id',
	loginRequired,
	authorizationRequired,
	doctorRequired,
	doctors_routes,
);

app.get('/api/v1/news', retrieveNews);

app.use(function(req, res, next) {
	let err = new Error('Not found');
	err.status = 404;
	next(err);
});

app.use(errorHandler);

server.listen(PORT, function() {
	console.log(`listen on port ${PORT}`);
});
