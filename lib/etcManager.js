'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');

var Etcd = require('node-etcd');
var _ = require('underscore');

var EtcManager = (function () {
	function EtcManager(host, port) {
		_classCallCheck(this, EtcManager);

		this.theEtcd = new Etcd(host, port);
		Promise.promisifyAll(this.theEtcd); // promise
	}

	_createClass(EtcManager, [{
		key: 'init',
		value: function init() {
			return new Promise(function (resolve, reject) {
				console.log('=== EtcManager inited! ===');
				resolve();
			});
		}
	}, {
		key: '_ensureEtcd',
		value: function _ensureEtcd() {

			var $this = this;
			return new Promise(function (resolve) {

				resolve($this.theEtcd);
			});
		}
	}, {
		key: 'getKey',
		value: function getKey(key) {
			var $this = this;

			return new Promise(function (resolve, reject) {

				$this._ensureEtcd().then(function (etcd) {
					return etcd.getAsync(key);
				}).then(function (getValue) {
					var jValue = JSON.parse(getValue[0].node.value);
					resolve(jValue);
				})['catch'](function (err) {
					if (err.errorCode == 100) {
						// key not found
						resolve(null);
					} else {
						reject(err);
					}
				});
			});
		}
	}, {
		key: 'setKey',
		value: function setKey(key, value) {
			var $this = this;
			return new Promise(function (resolve, reject) {

				$this._ensureEtcd().then(function (etcd) {
					return etcd.setAsync(key, value);
				}).then(function (result) {
					resolve(result);
				})['catch'](function (err) {
					reject(err);
				});
			});
		}
	}, {
		key: 'getActors',
		value: function getActors() {
			var $this = this;
			return new Promise(function (resolve, reject) {
				$this.getKey($this.getKeyName()).then(function (value) {
					if (value == null) {
						resolve({});
					} else {
						var infos = value;
						resolve(infos);
					}
				}).error(function (err) {
					reject(err);
				});
			});
		}
	}, {
		key: 'getKeyName',
		value: function getKeyName() {
			return 'cosmos:actorInfos14';
		}
	}, {
		key: 'registerActor',
		value: function registerActor(actorMgr) {
			var $this = this;
			return new Promise(function (resolve, reject) {
				return $this.getKey($this.getKeyName()).then(function (value) {

					// get no actors, so create it
					if (value == null) {
						value = {};
					}
					// TODO: Check exist
					// console.dir(actorConfig);

					// the object save on the Etcd, include:
					// * actor config
					// * actor all remote functions
					var actorInfo = _.clone(actorMgr.config);
					actorInfo.functions = [];
					var funcs = Object.getOwnPropertyNames(actorMgr.remote.__proto__);
					funcs.forEach(function (funcName) {
						console.log('Register actor func: ' + funcName);
						actorInfo.functions.push(funcName);
					});
					value[actorInfo.name] = actorInfo;

					var jsonValue = JSON.stringify(value);
					return $this.setKey($this.getKeyName(), jsonValue);
				}).then(function (setRet) {
					// set success!
					console.info(setRet);
					resolve(true);
				}).error(function (err) {
					reject(err);
				});
			});
		}
	}]);

	return EtcManager;
})();

module.exports = EtcManager;