'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var logger = require('./logger').getLogger('cosmos');

var Application = (function () {
	function Application() {
		_classCallCheck(this, Application);
	}

	_createClass(Application, [{
		key: 'init',
		value: function init() {
			return new Promise(function (resolve, reject) {

				logger.info('=== Application inited! ===');
				resolve();
			});
		}
	}]);

	return Application;
})();

module.exports = Application;