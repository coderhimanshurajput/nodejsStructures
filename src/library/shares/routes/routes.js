const path = require('path');
const fs = require('fs');
const location = path.resolve('./src/modules');

module.exports = (app) => {
	// @ require all controllers here
	fs.readdirSync(location)
		.filter((dir) => {
			return fs.statSync(`${location}/${dir}`).isDirectory();
		})
		.forEach((dir) => {
			const fileObj = require(path.resolve(`./src/modules/${dir}/routes/routes`));
			app.use(fileObj.base, fileObj.router);
		});
};
