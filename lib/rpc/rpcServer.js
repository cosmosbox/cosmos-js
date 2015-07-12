'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var zerorpc = require('zerorpc');
var util = require('util');
var logger = require('../logger').getLogger('cosmos');

var RpcServer = function RpcServer(actor) {
	_classCallCheck(this, RpcServer);

	this.actor = actor;
	// Self Actor Rpc Server
	this.rpcServer = new zerorpc.Server({
		call: function call() {

			var funcName = arguments[0];

			var funcArgs = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
			var reply = arguments[arguments.length - 1];

			console.dir(reply);
			actor.onRpcCall(funcName, funcArgs).then(function (ret) {
				console.error(ret);
				reply(null, ret);
			});
		},

		// Get all rpc server functions
		getFunctions: function getFunctions() {
			reply(null, actor.getFunctions());
		}
	});
	var uri = util.format('tcp://0.0.0.0:%s', actor.config.rpcPort);
	this.rpcServer.bind(uri);
	logger.info('Create Rpc Server: ' + uri);

	this.rpcServer.on('error', function (error) {
		logger.error('RPC server error:', error);
	});
};

module.exports = RpcServer;