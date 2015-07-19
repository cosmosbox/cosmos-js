
var http = require('http');

var Handler = function(actor) {
	this.actorConfig = actor.actorConfig;

	http.createServer(function(req, res) {
		
		app.rpc.http1.whoAreYou.then(function(result) {

			res.writeHeader(status,{'Content-Type':'text/plain'});
    		res.end('Ask http1, answer: ' + result);
    		
		});

	}).listen(actorConfig.httpPort);
}


module.exports = Handler;