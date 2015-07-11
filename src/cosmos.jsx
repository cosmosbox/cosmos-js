var Application = require('./application');
var EtcManager = require('./etcManager');
var Rpc = require('./rpc');
var ActorManager = require('./actorManager');

class Cosmos {


	constructor(appConfig, actorConfig) {

		this.appConfig = appConfig;
		this.isStarted = false;
		this.actorConfig = actorConfig;

		this.app = new Application();
		this.etc = new EtcManager('127.0.0.1', '4001');

		this.actorMgr = new ActorManager(this.actorConfig);

		this.rpc = new Rpc(this.etc, this.actorMgr);
	}

	start() {
		var $this = this;
		return $this.app.init()
				.then(() => $this.etc.init())
				.then(() => $this.actorMgr.init())
				.then(() => $this.rpc.init())
				.then(()=>{
					console.log("=== Cosmos finish started! ===");
					$this.isStarted = true;
				});
	}

	getApp() {
		return this.app;
	}

}

var _instance : Cosmos = null;

module.exports = {
	Cosmos : Cosmos,
	
	getApp : function() {
		if (_instance == null) {
			_instance = new Cosmos();
			_instance.start();
		}
		return _instance.getApp();
	}
}