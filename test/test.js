var assert = require('chai').assert;
var _ = require('underscore');
var Promise = require('bluebird');


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
	var etcManager = new EtcManager('localhost', 4001);
	it('etcd get & set', function() {

		var rand = _.random(0, 10000).toString();
		return etcManager.setKey('test:etcd_test', rand)
			.then(function(){
				return etcManager.getKey('test:etcd_test');
			})
			.then(function(value, info) {
				assert.equal(value, rand);

			}).catch(function(err) {
				console.error(err);
				assert.equal(false);
			});
	});

	it('getActors is json object', function() {
		return etcManager.getActors()
			.then(function(actors) {

				assert.typeOf(actors, 'object', "Get actors: " + actors);

			})
			.catch(function(err) {
				assert(false, "get actor failed!");
			});
	});

	
});

describe('rpc', function() {
	
	var TestHandler = require('./testHandler');
	var TestRemote = require('./testRemote');
	var Cosmos = require('../lib').Cosmos;

	var appConfig1 = require('../lib/configDefault').appConfig;
	var nodeConfig1 = {
		name : "actor1",
		handler : TestHandler,
		remote : TestRemote,
		host : "localhost",
		rpcPort:12345,
		rpcServPort:12344
	};
	var actor1 = new Cosmos(appConfig1, nodeConfig1);

	var nodeConfig2 = {
		name : "actor2",
		handler : TestHandler,
		remote : TestRemote,
		host : "localhost",
		rpcPort:12346
	};

	var appConfig2 = require('../lib/configDefault').appConfig;
	var actor2 = new Cosmos(appConfig2, nodeConfig2);
	it("test rpc", function() {
		return actor1.start()
			.then(()=> actor2.start())
			.then(() => {
				return new Promise(resolve => {
					assert(actor1.rpc.actor2, 'must has actor 2');
					assert.typeOf(actor1.rpc.actor2.rpcTestFromActor1, 'function');
					resolve();
				});
			})
			.then(()=>{
				assert(actor1);
				assert(actor1.rpc);
				assert(actor1.rpc.actor2);
				assert.typeOf(actor1.rpc.actor2.rpcTestFromActor1, 'function');

				return actor1.rpc.actor2.rpcTestFromActor1()
					.then(ret => {
						assert.equal(ret, "from node 1", "from actor1 RPC actor2:" + ret);
					}).catch(err => {
						console.error(err);
						assert(false);
					});

			})
			.then(() => {
				return actor2.rpc.actor1.rpcTestFromActor2()
					.then(function(ret) {
						assert.equal(ret, "from node 2")
					}).catch(function(err) {
						console.error(err);
						assert.equal(false);
					});
			});
	});


});