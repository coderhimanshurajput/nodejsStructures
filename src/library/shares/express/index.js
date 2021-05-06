const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
// csrf = require('csurf'),
const hpp = require('hpp');
const cors = require('cross');
const lusca = require('lusca');
const nocache = require('nocache');
const RateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const cookiesParser = require('cookie-parser');
const compression = require('compression');
const session = require('express-session');

module.exports = (app) => {
	// app.use(cors());
	app.use(xss());
	app.use(nocache());
	app.use(compression());
	app.use(cookiesParser());
	app.use((req, res, next) => {
		bodyParser.json({
			limit: '5mb',
			verify: (req, res, buf, encoding) => {
				req.rawBody = buf.toString();
			},
		})(req, res, (err) => {
			if (err) {
				res.status(400).send('Bad body Request');
				return;
			}
			next();
		});
	});

	app.use(helmet()); // helps you secure your Express apps by setting various HTTP headers.
	// app.use(csrf()); // csurf protection middleware , cookie-parser to be initialized first.
	app.use(hpp()); // Express middleware to protect against HTTP Parameter Pollution attacks
	app.use(bodyParser.json()); // parse application/json
	app.use(bodyParser.json({ type: 'application/*+json' }));
	// parse some custom thing into a Buffer
	app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
	// parse an HTML body into a string
	app.use(bodyParser.text({ type: 'text/html' }));
	app.disable('x-powered-by'); // disable X-Powered-By header
	app.use(helmet.hidePoweredBy({ setTo: 'DummyServer 1.0' })); // change value of X-Powered-By header to given value
	app.use(helmet.noSniff()); // set X-Content-Type-Options header
	app.use(helmet.frameguard()); // set X-Frame-Options header
	app.use(helmet.xssFilter()); // set X-XSS-Protection header
	app.use(helmet.ieNoOpen());
	app.use(
		lusca.csp({
			policy:
				"default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'",
		})
	);
	app.use(lusca.xframe('SAMEORIGIN')); // The value for the header, e.g. DENY, SAMEORIGIN or ALLOW-FROM uri.
	app.use(lusca.p3p('ABCDEF')); // value String - Required. The compact privacy policy
	app.use(lusca.hsts({ maxAge: 7200000 })); // Enables HTTP Strict Transport Security for the host domain.
	app.use(lusca.xssProtection(true)); // If the header is enabled or not (see header docs)
	app.use(lusca.nosniff()); // Enables X-Content-Type-Options header to prevent MIME-sniffing a response away from the declared content-type
	app.use(lusca.referrerPolicy('same-origin')); // The value for the header, e.g. origin, same-origin, no-referrer. Defaults to `` (empty string).
	app.set('trust proxy', 1);
	app.use(
		helmet({
			frameguard: {
				action: 'deny',
			},
		})
	);
	const limiter = new RateLimit({
		windowMs: 10 * 60 * 1000, // 15 minutes
		max: 50, // limit each IP to 100 requests per windowMs
		delayMs: 0, // disable delaying — full speed until the max limit is reached
	});
	app.use(limiter);

	// allow/enable cross origin request
	app.use(function (req, res, next) {
		res.header('X-XSS-Protection', '1; mode=block');
		res.header('X-Frame-Options', 'deny');
		res.header('X-Content-Type-Options', 'nosniff');
		res.header('Access-Control-Allow-Methods', 'PUT, POST, HEAD , OPTIONS ');
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept,Authorization'
		);
		// res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");   // this content security policy
		res.setHeader('Access-Control-Allow-Credentials', 'true');

		// res.locals.csrfToken = req.csrfToken();
		next();
	});
};
