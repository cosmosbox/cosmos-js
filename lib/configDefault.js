'use strict';

module.exports = {
	baseConfig: {
		name: 'cosmos'
	},
	etcConfig: {
		host: '127.0.0.1',
		port: '4001',
		heartbreak: 10 // every 10 seconds to register actor, and get all actor infos
	}

};