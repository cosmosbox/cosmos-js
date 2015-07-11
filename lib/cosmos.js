'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Application = require('./application');
var EtcManager = require('./etcManager');
var Rpc = require('./rpc');
var ActorManager = require('./actorManager');

var Cosmos = (function () {
	function Cosmos(appConfig, actorConfig) {
		_classCallCheck(this, Cosmos);

		this.appConfig = appConfig;
		this.isStarted = false;
		this.actorConfig = actorConfig;

		this.app = new Application();
		this.etc = new EtcManager('127.0.0.1', '4001');

		this.actorMgr = new ActorManager(this.actorConfig);

		this.rpc = new Rpc(this.etc, this.actorMgr);
	}

	_createClass(Cosmos, [{
		key: 'start',
		value: function start() {
			var $this = this;
			return $this.app.init().then(function () {
				return $this.etc.init();
			}).then(function () {
				return $this.actorMgr.init();
			}).then(function () {
				return $this.rpc.init();
			}).then(function () {
				console.log('=== Cosmos finish started! ===');
				$this.isStarted = true;
			});
		}
	}, {
		key: 'getApp',
		value: function getApp() {
			return this.app;
		}
	}]);

	return Cosmos;
})();

var _instance = null;

module.exports = {
	Cosmos: Cosmos,

	getApp: function getApp() {
		if (_instance == null) {
			_instance = new Cosmos();
			_instance.start();
		}
		return _instance.getApp();
	}
};