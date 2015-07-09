var cosmos = module.exports = {};


cosmos.addNodeClass = function (nodeClass) {

}


cosmos.addNodeClassByPath = function(folderPath) {

}

cosmos.nodeManager = require('./nodeManager');
cosmos.etcManager = require('./etcManager')('127.0.0.1', '4001');

var Promise = require('bluebird');
if (Promise) {
	Promise.promisifyAll(nodeManager);
	Promise.promisifyAll(etcManager);

	Promise.promisifyAll(cosmos);
}