var assert = require('chai').assert;
var _ = require('underscore');
var Promise = require('bluebird');
var logger = require('../lib/logger').getLogger('test');
var util = require('util');

var appConfig = require('../lib/configDefault');

describe('bluebird', function() {

	it('#custom promisifyAll', function () {
		function Tester() {

		}
		Tester.prototype.doSomething = function(var1, callback) {
			if (callback)
				callback(null, {
					var1: var1,
					var2: var1 - 1
				});
		}


		var tester = new Tester();
		Promise.promisifyAll(tester);
		
		assert.notEqual(tester.doSomethingAsync, undefined);

		tester.doSomethingAsync(999).then(function(ret) {
			assert.equal(ret.var1, 999);
			assert.equal(ret.var2, 998);
		});

	});
});

describe('etcdManager', function() {
	// var Etcd = require('node-etcd');
	// var etcd = new Etcd();
	// Promise.promisifyAll(etcd);
	var EtcManager = require('../lib/etcManager');
	var etcManager = new EtcManager(appConfig.etcConfig);
	it('etcd get & set', function() {

		var rand = _.random(0, 10000).toString();
		return etcManager.setKey('etcd_test', rand)
			.then(function(){
				return etcManager.getKey('etcd_test');
			})
			.then(function(value, info) {
				assert.equal(value, rand);

			}).catch(function(err) {
				console.error(err);
				assert.equal(false);
			});
	});
	it('etcd dir set & get!', function() {
		return etcManager.setKey('test/A', '{"a":"AValue"}').then(function() {
			return etcManager.setKey('test/B', 'BValue');
		}).then(function() {
			return etcManager.getKey('test/')
		}).then(function(values) {
			assert.typeOf(values, 'object');
			console.log("\t" + util.inspect(values));

			assert.equal(values.A.a, "AValue");
			assert.equal(values.B, "BValue");
		});

	});


	// it('test the etcd watchcher', function() {
	// 	var onWatcherChagned = function(etcdValue) {
	// 		logger.error("[onWatcherChagned]");
	// 		var jValue = etcManager._etcdNodeToJSON(etcdValue.node);			
	// 		assert(true);
	// 	}
	// 	var watcher = etcManager.theEtcd.watcher('test/');
	// 	watcher.on("change", onWatcherChagned); // Triggers on all changes
	// 	watcher.on("set", onWatcherChagned); // Triggers on specific changes (set ops)
	// 	watcher.on("delete", onWatcherChagned); // Triggers on delete.
		
	// 	watcher.on("error", function() {
	// 		assert(false);
	// 		logger.error("[initActorsWatcher]watcher error! reconnecct")
			
	// 	});
	// 	return new Promise(function(resolve) {
	// 		logger.info("Wait 2s to watacher......");
	// 		setTimeout(resolve, 1000);
	// 	}).then(function() {
	// 		return etcManager.setKey('test/C', "value")
	// 	}).then(function() {
	// 		return new Promise(function(resolve) {
	// 			setTimeout(resolve, 1000);
	// 		});
	// 	})
		
	// });
	it('getActors is object', function() {
		return etcManager.getActors()
			.then(function(actors) {
				assert.typeOf(actors, 'object', "Get actors: " + actors);

			})
			.catch(function(err) {
				logger.error(err);
				assert(false, "get actor failed!");
			});
	});

	
});

describe('rpc', function() {
	
	var TestHandler = require('./testHandler');
	var TestRemote = require('./testRemote');
	var Cosmos = require('../lib').Cosmos;

	var appConfig1 = require('../lib/configDefault');
	var actorConfig1 = {
		name : "actor1",
		handler : TestHandler,
		remote : TestRemote,
		host : "localhost",
		rpcPort:12345
	};
	var actor1 = new Cosmos(appConfig1, actorConfig1);

	var actorConfig2 = {
		name : "actor2",
		handler : TestHandler,
		remote : TestRemote,
		host : "localhost",
		rpcPort:12346
	};

	var appConfig2 = require('../lib/configDefault');
	var actor2 = new Cosmos(appConfig2, actorConfig2);

	it("test rpc", function() {
		return actor1.start()
			.then(function() { 
				actor2.start() 
			}).then(function() {
				return new Promise(function(resolve) {
					assert(actor1.rpc.actor2, 'must has actor 2');
					assert.typeOf(actor1.rpc.actor2.rpcTestFromActor1, 'function');
					resolve();
				});
			}).then(function() {
				assert(actor1);
				assert(actor1.rpc);
				assert(actor1.rpc.actor2);
				assert.typeOf(actor1.rpc.actor2.rpcTestFromActor1, 'function');

				return actor1.rpc.actor2.rpcTestFromActor1()
					.then(function(ret) {
						assert.equal(ret, "from node 1", "from actor1 RPC actor2:" + ret);
					}).catch(function(err) {
						logger.error(err);
						assert(false);
					});

			})
			.then(function() {
				return actor2.rpc.actor1.rpcTestFromActor2()
					.then(function(ret) {
						logger.info("RPC from node 2");
						assert.equal(ret, "from node 2")
					}).catch(function(err) {
						logger.error(err);
						assert.equal(false);
					});
			});
	});


});