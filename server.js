require('dotenv').config();
const app = require('express')();
const path = require('path');
const ENV = require(path.resolve(`./src/library/environment/${process.env.NODE_ENV}`));
const chalk = require('chalk');
const Art = require('figlet');
const ora = require('ora');

async function expressServer() {
	const server = require('http').createServer(app);
	await require(path.resolve('./src/library/shares/server'))(app, ENV);
	server.listen(ENV.PORT, () => {
		// eslint-disable-next-line no-console
		const ServerMess = ora(
			chalk`{bgYellow Node Js server running on {green.bold ${
				(process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') +
				ENV.APP_HOST +
				':' +
				ENV.PORT
			}} port at {green.bold ${ENV.MODE_TYPE}}..}`
		).start();
		setTimeout(() => {
			ServerMess.stop();
			ServerMess.succeed();
		}, 2000);
	});
}

function serverStart() {
	const ServerMessage = Art('! ! Server Start ! !', function (err, data) {
		if (err) {
			// eslint-disable-next-line no-console
			console.log('Something went wrong...');
			console.dir(err);
			return;
		}
		console.log(data);
	});
	return ServerMessage;
}

async function Waiting() {
	const _waiting = ora('Server is start with in 1 mint Please wait').start();
	setTimeout(() => {
		_waiting.stop();
		_waiting.succeed();
	}, 2000);
}

async function mainServer() {
	// server run without socket
	serverStart();
	await setTimeout(Waiting, 300);
	await setTimeout(expressServer, 6000);
}
if (require.main === module) {
	// @ run server without cluster module
	module.exports = mainServer();
} else {
	// @ export startServer method to run application using cluster module
	module.exports = mainServer();
}

module.exports = app;
