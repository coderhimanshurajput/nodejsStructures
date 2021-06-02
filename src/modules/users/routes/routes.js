const path = require('path');
const router = require('express-promise-router')();
const dir = `${path.dirname(__dirname)}/controllers`;
const directory = require(path.resolve('./src/library/shares/readDirectory'));
const ENV = require(path.resolve(`./src/library/environment/${process.env.NODE_ENV}`));

const ReadDirectory = new directory.readDirectory();
// const Middleware = new helper.middleware();
let fileObj = ReadDirectory.requireFiles(dir);

router.post('/login', fileObj['userCtrl'].getUser);


module.exports = {
	router: router,
	base: `/${ENV.API_PATH}/${ENV.API_VERSION}`,
};
