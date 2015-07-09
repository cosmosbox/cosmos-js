var Promise = require('bluebird');

var Etcd = require('etcd');

var etcManager = module.exports = function(host) {

	this.theEtcd = new Etcd();
	Promise.promisifyAll(this.);

}

var self = etcManager.prototype;

self._ensureEtcd = function() {

	return new Promise(function(resolve) {
		resolve(theEtcd);
	});
}

self._getKey = function(key) {
	return new Promise(function(resolve) {

		self._ensureEtcd()
			.then(function() {
				return etcd.getAsync(key);
			})
			.then(function(getValue) {
				resolve(getValue);
			});

	});
}

self._setKey = function(key, value) {
	return new Promise(function(resolve) {
		self._ensureEtcd()
			.then(function() {
				return etcd.setAsync(key, value);
			})
			.then(function() {
				resolve();
			});
	});
}
self.getNodeInfos = function(callback) {
	return new Promise(function(resolve, reject) {
		self_getKey("cosmos:nodeInfos")
			.then(function(infos) {
				resolve(infos);
			})
			.error(function(err) {
				reject(err)
			});
	});
};