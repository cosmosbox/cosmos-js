var Promise = require('bluebird');

var Etcd = require('node-etcd');

var EtcManager = function(host, port) {

	this.theEtcd = new Etcd(host, port);
	Promise.promisifyAll(this.theEtcd);
	// console.error('start set');
	// this.theEtcd.set('abc', 'aaan', function(a,b) {
	// 	console.error(a);
	// 	console.error('ok!');
	// 	console.error(b);

	// 	this.theEtcd.get('abc', function(a2, b2) {
	// 		console.error(a2);
	// 		console.error('ok!2');
	// 		console.error(b2);
	// 	});
	// });

}

var proto = EtcManager.prototype;

proto._ensureEtcd = function() {

	var $this = this;
	return new Promise(function(resolve) {

		resolve($this.theEtcd);
	});
}

proto._getKey = function(key) {
	var $this = this;

	return new Promise(function(resolve) {

		$this._ensureEtcd()
			.then(function(etcd) {
				return etcd.getAsync(key);
			})
			.then(function(getValue) {
				resolve(getValue);
			});

	});
}

proto._setKey = function(key, value) {
	var $this = this;
	return new Promise(function(resolve, reject) {

		$this._ensureEtcd()
			.then(function(etcd) {
				console.error("here1");
				return etcd.setAsync(key, value);
			})
			.then(function(result) {

		console.error(result);
				resolve(result);
			}).catch(function(err) {
				console.error("here3");
				console.error(err);
				reject(err);
			});
	});
}
proto.getNodeInfos = function(callback) {
	var $this = this;
	return new Promise(function(resolve, reject) {
		$this._getKey("cosmos:nodeInfos")
			.then(function(infos) {
				resolve(infos);
			})
			.error(function(err) {
				reject(err)
			});
	});
};

module.exports = function(host) {
	return new EtcManager(host);
};