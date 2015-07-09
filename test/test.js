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
	var etcManager = require('../lib/etcManager')('localhost', 4001);
	it('etcd get & set', function() {

		var rand = _.random().toString();
		return etcManager._setKey('test:etcd_test', rand)
			.then(function(){
				return etcManager._getKey('test:etcd_test');
			})
			.then(function(getValue) {
				assert.equal(getValue == rand);

			});
	});

	it('getNodeInfo is json object', function() {

		
		return etcManager.getNodeInfos()
			.then(function(infos) {
				assert.equal(typeof infos, 'object');

			});
	});

	
});