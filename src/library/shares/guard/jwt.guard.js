const expressJWT = require('express-jwt');
const path = require('path');
const unlessRoutes = require(path.resolve('./src/library/shares/routes/unless.routes'));

// const Helper = require(path.resolve('./config/library/helper')),
//   Middleware = new Helper.middleware();

module.exports = (app, ENV) => {
	// @ validate api with express-jwt
	app.use(
		expressJWT({
			secret: new Buffer.from(ENV.JWT_KEY).toString('base64'),
			algorithms: ['sha1', 'RS256', 'HS256'],
		}).unless({
			// @ pass api without validating
			path: unlessRoutes,
		})
	);

	// @ global error handling middleware
	app.use(function (err, req, res, next) {
		if (err.name === 'UnauthorizedError') {
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
		next()
	});

	app.use(function (err, req, res, next) {
		if (err.name === 'TypeError') {
			// @ write error logs into file
			// Middleware.writeErrorIntoFile(req, err);
			return res.status(401).json({ message: err.name + ': ' + err.message });
			next();
		}
	});
};
