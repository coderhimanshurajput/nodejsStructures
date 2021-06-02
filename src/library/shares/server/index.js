'use strict';
const path = require('path');

// @ require
module.exports = async (server, ENV) => {
	require(path.resolve('./src/library/shares/express'))(server);
	require(path.resolve('./src/library/shares/guard'))(server, ENV);
	require(path.resolve('.//src/library/shares/routes/routes'))(server);
	setTimeout(() => {
		require(path.resolve('./src/library/shares/database/mongo'))(ENV);
	}, 2500);
	setTimeout(() => {
		console.log('///////....')
		// global.redisConn = require(path.resolve('./config/library/database/redisConnection'))(ENV);
	}, 3500);
};
