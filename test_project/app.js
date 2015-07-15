var app = require('../index').app;
var logger = require('cosmos-logger').getLogger('cosmos-app');
var util = require('util');

app.start().then(function() {
	console.log('start finished!');
}).catch(function(err) {
	logger.error(err);
});
// console.dir(app.config.base);
// console.dir(app.actorTypes);