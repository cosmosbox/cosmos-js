
var TestRemote = function() {}

TestRemote.prototype.rpcTestFromActor1 = function() {
	return "from node 1";
}
TestRemote.prototype.rpcTestFromActor2 = function() {
	return "from node 2";
}

module.exports = TestRemote;