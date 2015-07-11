
class TestRemote {

	rpcTestFromActor1() {
		return "from node 1";
	}
	rpcTestFromActor2() {
		return "from node 2";
	}
}

module.exports = TestRemote;