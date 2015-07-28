'use strict';

var logger = require('../../logger').getLogger('cosmos');
var Promise = require('bluebird');
var _ = require('underscore');

var RpcClient = function RpcClient(client) {
	this.client = client;
};

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