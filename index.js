
var cosmos = require('./lib/');
module.exports = cosmos;

var program = require('commander');
program.version('0.0.1');

program.option('-n, --actorName [name]', 'Actor Name in config');
program.parse(process.argv);

if (program.actorName) {
	var actorName = program.actorName;
	console.log('start actor ....... %s', actorName);
	cosmos.app.init(actorName);
	return;
}

console.log('please --help');

