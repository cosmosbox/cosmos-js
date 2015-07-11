'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EtcManager = require('../etcManager');
var ActorManager = require('../actorManager');
var zerorpc = require('zerorpc');
var util = require('util');
var RpcClient = require('./rpcClient');
var RpcServer = require('./rpcServer');

var Rpc = (function () {
	function Rpc(etcManager, actor) {
		_classCallCheck(this, Rpc);

		this.ignoreMethods = ['init'];

		this.etcManager = etcManager;
		this.actor = actor;

		this.rpcClients = {};

		this.rpcServer = new RpcServer(this.actor);
	}

	_createClass(Rpc, [{
		key: 'init',
		value: function init() {
			// register
			var $this = this;
			return this.etcManager.registerActor(this.actor).then(function (isSuccess) {
				if (!isSuccess) {
					console.error('Error registerActor!');
					return new Promise(function (resolve) {
						resolve({});
					});
				} else {
					return $this.etcManager.getActors();
				}
			}).then(function (actors) {
				// get actors, function init

				for (var actorName in actors) {
					var actor = actors[actorName];
					var funcs = actor.functions;

					// create the Rpc client
					var client = new zerorpc.Client();
					var rpcHost = actor.host;
					var rpcPort = actor.rpcPort;
					var serverUri = 'tcp://' + rpcHost + ':' + rpcPort;

					// except self
					if (rpcHost == $this.actor.config.host && rpcPort == $this.actor.config.rpcPort) {
						console.log('Ignore self when rpc creatation');
						continue;
					}
					console.log('Connect to RPC Server: ' + serverUri);

					client.connect(serverUri);

					var rpcClient = new RpcClient(client);

					$this.rpcClients[actor.name] = rpcClient;

					// proxy to rpc
					var proxyFuncs = {};

					// define the Actor into this rpc class
					Object.defineProperty($this, actorName, {
						get: function get() {
							return proxyFuncs;
						}
					});

					// console.dir($this[actorName]);
					// rpc function create
					funcs.forEach(function (funcName) {
						console.log(util.format('Create Function: %s, From actor: %s', funcName, actor.host + ':' + actor.rpcPort));
						proxyFuncs[funcName] = function () {
							return new Promise(function (resolve, reject) {
								return rpcClient.call(funcName).then(function (res) {
									resolve(res);
								})['catch'](function (err) {
									reject(err);
								});
							});
						}
						// console.log("the function: " + funcName);
						;
					});
				}
			}).then(function () {
				console.log('=== Cosmos finish started! ===');
			});
		}
	}]);

	return Rpc;
})();

module.exports = Rpc;