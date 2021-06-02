const path = require('path');
const fs = require('fs');

class ReadDirectory {

	getFiles(dir, skip) {
		let files = fs.readdirSync(dir);

		files = files
			.map((file) => {
				file = path.parse(file).name;
				return file;
			})
			.filter((file) => {
				if (Array.isArray(skip)) {
					return skip.indexOf(file) === -1;
				}
				return true;
			});
		return files;
	}

	requireFiles(dir, skip) {
		if (dir) {
			const files = this.getFiles(dir, skip);

			if (Array.isArray(files)) {
				const fileObj = {};

				files.forEach((file) => {
					fileObj[file] = require(`${dir}/${file}`);
				});

				return fileObj;
			} else {
				throw new Error('file Array or directory not found');
			}
		} else {
			throw new Error('directory not received to read and require files');
		}
	}

	fileName(dir) {}
}

module.exports = {
	readDirectory: ReadDirectory,
};
