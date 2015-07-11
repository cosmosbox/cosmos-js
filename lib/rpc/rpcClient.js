"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RpcClient = (function () {
	function RpcClient(client) {
		_classCallCheck(this, RpcClient);

		this.client = client;
	}

	_createClass(RpcClient, [{
		key: "call",
		value: function call(funcName) {
			var _this = this;

			var $arguments = arguments;
			return new Promise(function (resolve, reject) {
				console.log("Rpc to function: " + funcName);
				var $this = _this;
				var applyArgs = [];
				applyArgs.push("call"); // server.call rpc top func
				var funcArgs = [];
				funcArgs.push(funcName);
				for (var i in $arguments) {
					if (i != 0) {
						funcArgs.push($arguments[i]);
					}
				}
				applyArgs.push(funcArgs);
				applyArgs.push(function (error, res, more) {
					if (error) {
						console.error(error);
						reject(error);
					} else {
						resolve(res);
					}
				});

				console.log("Promise to function: " + funcName);
				console.dir($this.client);
				$this.client.invoke.apply($this.client, applyArgs);
				// $this.client.invoke('rpcTestFromActor1', (err, res, more) => {
				// 	console.error("back!!!!!!!!!!!!");
				// });
			});
		}
	}]);

	return RpcClient;
})();

module.exports = RpcClient;