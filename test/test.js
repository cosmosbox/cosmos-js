var assert = require('assert');
var _ = require('underscore');
var Promise = require('bluebird');


describe('bluebird', function() {

	it('#base', function () {
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

	// it('etcd get & set', function() {

	// 	var rand = _.random().toString();
	// 	etcd.setAsync('test:etcd_test', rand)
	// 		.then(function(){
	// 			return getAsync('test:etcd_test');
	// 		})
	// 		.then(function(getValue) {
				
	// 			assert.equal(getValue == rand);

	// 		});
	// });

	it('getNodeInfoAsync is json object', function() {

		var etcManager = require('../lib/etcManager');
		etcManager.getNodeInfosAsync()
			.then(function(infos) {
				assert.equal(typeof infos, 'object');

			});
	});

	
});