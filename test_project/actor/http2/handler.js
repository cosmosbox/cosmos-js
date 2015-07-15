
var http = require('http');

var Handler = function(actor) {
	this.actorConfig = actor.actorConfig;

	http.createServer(function(req, res) {
		
		res.writeHeader(status,{'Content-Type':'text/plain'});
    	res.end('Ask http1, answer: ' + 'yes!');

	}).listen(actorConfig.httpPort);
}


module.exports = Handler;