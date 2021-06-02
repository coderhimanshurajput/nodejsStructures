const path = require('path');

module.exports = (server, ENV) => {
	require(path.resolve('./src/library/shares/guard/jwt.guard'))(server, ENV);
	require(path.resolve('./src/library/shares/guard/xss.guard'))(server, ENV);
};
