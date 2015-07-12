var zerorpc = require('zerorpc');
var util = require('util');
var logger = require('../logger').getLogger("cosmos");
class RpcServer {
	constructor(actor) {

		this.actor = actor;
		// Self Actor Rpc Server
		this.rpcServer = new zerorpc.Server({
			call : function() {

				var funcName = arguments[0];

				var funcArgs = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
				var reply = arguments[arguments.length - 1];

				console.dir(reply);
				actor.onRpcCall(funcName, funcArgs)
					.then(ret => {
						console.error(ret);
						reply(null, ret);
					});
			},

			// Get all rpc server functions
			getFunctions : function() {
				reply(null, actor.getFunctions());
			}
		});
		var uri = util.format("tcp://0.0.0.0:%s", actor.config.rpcPort);
		this.rpcServer.bind(uri);
		logger.info("Create Rpc Server: " + uri);

		this.rpcServer.on("error", function(error) {
		    logger.error("RPC server error:", error);
		});
	}

}

module.exports = RpcServer;