'use strict';

module.exports = {
	baseConfig: {
		name: 'cosmos',
		etcdKeyPath:"cosmos-abc-cluster"
	},
	etcConfig: {
		host: '127.0.0.1',
		port: '4001',
		heartbreak: 10 // every 10 seconds to register actor, and get all actor infos
	},
	actorConfig: {
		// actor
	}

};