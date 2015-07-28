'use strict';

var logger = require('../../logger').getLogger('cosmos');
var Promise = require('bluebird');

var RpcClient = function RpcClient(client) {
	this.client = client;
};

RpcClient.prototype.call = function (funcName) {
	var _this = this;

	var $arguments = arguments;
	return new Promise(function (resolve, reject) {
		
		var $this = _this;
		var applyArgs = [];
		applyArgs.push('call'); // server.call rpc top func
		var funcArgs = [];
		funcArgs.push(funcName);
		for (var i in $arguments) {
			if (i != 0) {
				funcArgs.push($arguments[i]);
			}
		}
		applyArgs.push(funcArgs);
		applyArgs.push(function (error, res) {
			if (error) {
				console.error(error);
				reject(error);
			} else {
				resolve(res);
			}
		});

		logger.info('Rpc to function: ' + funcName);
		// logger.info('Rpc to args: ' + applyArgs);
		$this.client.call.apply($this.client, applyArgs);
	});
};

module.exports = RpcClient;