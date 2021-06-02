/* eslint-disable no-console,no-mixed-spaces-and-tabs */
const mongoose = require('mongoose');
const ora = require('ora');
// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const chalk = require('chalk');
const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

// mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('bufferCommands', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = require('bluebird');

// eslint-disable-next-line max-lines-per-function
module.exports = function (ENV) {
	mongoose.set('debug', ENV.MONGO_DEBUG);
	// eslint-disable-next-line no-unused-vars
	const options = {
		/*	'reconnectTries': Number.MAX_VALUE, // Never stop trying to reconnect
              // eslint-disable-next-line sort-keys
              'reconnectInterval': 500, // Reconnect every 500ms */
		// eslint-disable-next-line sort-keys
		poolSize: 10, // Maintain up to 10 socket connections
		// If not connected, return errors immediately rather than waiting for reconnect
		// eslint-disable-next-line sort-keys
		bufferMaxEntries: 0,
		// keepAlive: 300000,
		// connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
		// socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		// eslint-disable-next-line sort-keys
		family: 4, // Use IPv4, skip trying IPv6
		ssl: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	};
	// for local setup

	// server db setup
	const url = `${ENV.MONGO_DIALECT}://${ENV.DB_USERNAME}:${ENV.DB_PASSWORD}@${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`; // this is URL used with credentials
	/* create mongoDB connection */
	const mongoConn = mongoose.connect(url, options);

	/* if if connection established */
	mongoose.connection.on('connected', () => {
		// ora(connected('Mongoose default connection is open to ', url)).succeed();
		const _waiting = ora(connected('Mongoose default connection is open to ', url)).start();
		setTimeout(() => {
			_waiting.stop();
			_waiting.succeed();
		}, 1000);
	});

	/* if unable to connect to DB */
	mongoose.connection.on('error', (err) => {
		console.log(error('Mongoose default connection has occured ' + err + ' error'));
	});

	/* if connection has been break due to any reason */
	// eslint-disable-next-line no-unused-vars,handle-callback-err
	mongoose.connection.on('disconnected', (err) => {
		console.log(disconnected('Mongoose default connection is disconnected'));
	});

	process.on('SIGINT', function () {
		mongoose.connection.close(function () {
			console.log(
				termination(
					'Mongoose default connection is disconnected due to application termination'
				)
			);
			// eslint-disable-next-line no-process-exit
			process.exit(0);
		});
	});
	return mongoConn;
};
