'use strict';
const path = require('path');

// @ require
module.exports = async (server, ENV) => {
	require(path.resolve('./src/library/shares/express'))(server);
	// require(path.resolve('./config/library/guard'))(server, ENV);
	// require(path.resolve('./config/library/routes/routes'))(server);
	// global.redisConn  = require(path.resolve('./config/library/database/redisConnection'))(ENV);
	// require(path.resolve('./config/library/database/mongoConnection'))(ENV);
};
