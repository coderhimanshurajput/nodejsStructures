const path = require('path');

const RequestHandler = require(path.resolve('./src/library/shares/logs/requestHandler'));
const Logger = require(path.resolve('./src/library/shares/logs/logger'));
const logger = new Logger();
const requestHandler = new RequestHandler(logger);

module.exports = (app) => {
	// @ secure application from xxs attacks
	// app.use(validator());
	app.use(function (req, res, next) {
		if (!Object.keys(req.body).length === true && req.method === 'POST') {
			return requestHandler.sendError(req, res, 'Opps !! object is empty');
		} else if (isEmpty(req.body) === false) {
			return requestHandler.sendError(req, res, 'Opps !! one parameter is required');
		} else {
			return next();
		}
	});
};

function isEmpty(obj) {
	for (const prop in obj) {
		// eslint-disable-next-line no-prototype-builtins
		if (obj.hasOwnProperty(prop, obj))
			if (prop === '') {
				return false;
			} else {
				return true;
			}
	}
}
