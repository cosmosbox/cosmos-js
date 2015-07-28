'use strict';
// var zerorpc = require('axon-rpc');
var rpc = require('axon-rpc')
  , axon = require('axon');

var logger = require('../../logger').getLogger('cosmos');
var Promise = require('bluebird');
var _ = require('underscore');

var RpcClient = function RpcClient(actor) {
	this.actor = actor;
	var actorName = actor.name;
	var funcs = actor.functions;

	this.req = axon.socket('req');

	// create the Rpc client
	var client = new rpc.Client(this.req);
	this.host = actor.host;
	this.rpcPort = actor.rpcPort;
	this.serverUri = 'tcp://' + this.host + ':' + this.rpcPort;

	logger.debug('Connect to RPC Server: ' + this.serverUri);

	this.req.connect(this.serverUri);

	this.client = client;
};

RpcClient.prototype.close = function() {
	this.req.close();
}
RpcClient.prototype.call = function (funcName, funcArgs) {
	var _this = this;

	var $arguments = arguments;
	return new Promise(function (resolve, reject) {
		
		var $this = _this;
		var applyArgs = [];
		applyArgs.push('call'); // server.call rpc top func
		var newFuncArgs = [funcName];
		for (var i in funcArgs) {
			newFuncArgs.push(funcArgs[i]);
		}
		applyArgs.push(newFuncArgs);
		applyArgs.push(function (error, res) {

			if (error) {
				console.error(error);
				reject(error);
			} else {
				resolve(res);
			}
		});

		logger.debug('Rpc to function: ' + funcName);

		$this.client.call.apply($this.client, applyArgs);
	});
};

module.exports = RpcClient;