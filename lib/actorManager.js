'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');
var logger = require('./logger').getLogger('cosmos');

var ActorManager = (function () {
	function ActorManager(actorConfig) {
		_classCallCheck(this, ActorManager);

		this.config = actorConfig;

		this.name = this.config.name;
		this.handler = new actorConfig.handler();
		this.remote = new actorConfig.remote();
	}

	_createClass(ActorManager, [{
		key: 'init',
		value: function init() {
			return new Promise(function (resolve, reject) {
				logger.info('=== ActorManager inited! ===');
				resolve();
			});
		}
	}, {
		key: 'onRpcCall',

		// be called by remote
		value: function onRpcCall(funcName, funcArgs) {
			var $this = this;
			return new Promise(function (resolve, reject) {
				var func = $this.remote.__proto__[funcName];
				if (!func) {
					reject(new Error('not found func: ' + funcName));
				} else {
					var ret = func.apply($this.remote, funcArgs);
					if (ret instanceof Promise) {
						return ret.then(function (resolveValue) {
							resolve(resolveValue);
						})['catch'](function (err) {
							reject(err);
						});
					} else {
						resolve(ret);
					}
				}
			});
		}
	}, {
		key: 'getFunctions',
		value: function getFunctions() {}
	}]);

	return ActorManager;
})();

module.exports = ActorManager;