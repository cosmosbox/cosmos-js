var EtcManager = require('../etcManager');
var ActorManager = require('../actorManager');
var zerorpc = require('zerorpc');
var util = require('util');
var RpcClient = require('./rpcClient');
var RpcServer = require('./rpcServer');

class Rpc {

	constructor(etcManager : EtcManager, actor : ActorManager) {
		
		this.ignoreMethods = ['init'];

		this.etcManager = etcManager;
		this.actor = actor;

		this.rpcClients = {}

		this.rpcServer = new RpcServer(this.actor);
	}

	init() {
		// register
		var $this = this;
		return this.etcManager.registerActor(this.actor)
			.then(isSuccess => {
				if (!isSuccess) {
					console.error("Error registerActor!");
					return new Promise(resolve =>{
						resolve({});
					});
				} else {
					return $this.etcManager.getActors();
				}
			})
			.then(actors => {
				// get actors, function init

				for (var actorName in actors) {
					var actor = actors[actorName];
					var funcs = actor.functions;

					// create the Rpc client
					var client = new zerorpc.Client();
					var rpcHost = actor.host;
					var rpcPort = actor.rpcPort;
					var serverUri = `tcp://${rpcHost}:${rpcPort}`;
					
					// except self
					if (rpcHost == $this.actor.config.host && 
						rpcPort == $this.actor.config.rpcPort ) {
						console.log("Ignore self when rpc creatation");
						continue;
					}
					console.log("Connect to RPC Server: " + serverUri);

					client.connect(serverUri);
					
					var rpcClient = new RpcClient(client);

					$this.rpcClients[actor.name] = rpcClient;


					// proxy to rpc
					var proxyFuncs = {};

					// define the Actor into this rpc class
					Object.defineProperty($this, actorName, {
						get : function() {
							return proxyFuncs;
						}
					});

					// console.dir($this[actorName]);
					// rpc function create
					funcs.forEach(funcName => {
						console.log(util.format("Create Function: %s, From actor: %s", funcName, actor.host + ":" + actor.rpcPort));
						proxyFuncs[funcName] = function() {
							return new Promise((resolve, reject) => {
									return rpcClient.call(funcName)
										.then(res=>{
											resolve(res);
										})
										.catch(err => {
											reject(err);
										});
								});
						}
						// console.log("the function: " + funcName);
					});


				}
			})
			.then(()=> {
				console.log("=== Cosmos finish started! ===");
			});
	}
}

module.exports = Rpc;