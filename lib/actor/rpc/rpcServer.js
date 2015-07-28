'use strict';

var rpc = require('axon-rpc')
  , axon = require('axon')
  , rep = axon.socket('rep');

var util = require('util');
var logger = require('../../logger').getLogger('cosmos');

var RpcServer = function RpcServer(actor) {

	var $this = this;
	this.actor = actor;
	// Self Actor Rpc Server
	var server = 

	this.rpcServer = new rpc.Server(rep);

	this.rpcServer.expose({
		call: function call() {
			var funcName = arguments[0];

			var funcArgs = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
			var reply = arguments[arguments.length - 1];

			actor.onRpcCall(funcName, funcArgs).then(function (ret) {
				logger.error(ret);


						logger.error("======= i am " + $this.actor.name);
				reply(null, ret);
			});
		}

		// Get all rpc server functions
		// getFunctions: function getFunctions() {
		// 	reply(null, actor.getFunctions());
		// }
	});
	
	var uri = util.format('tcp://0.0.0.0:%s', actor.rpcPort);
	// this.rpcServer.bind(actor.rpcPort);
	rep.bind(uri);

	logger.debug('Create Rpc Server: ' + uri);

	// this.rpcServer.on('error', function (error) {
	// 	logger.error('RPC server error:', error);
	// });
};
module.exports = RpcServer;