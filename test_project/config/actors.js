module.exports = {

	http1 : {
		name : "http1",
		type : 'http1',
		
		// handler : TestHandler,
		// remote : TestRemote,
		host : "localhost",
		rpcPort:12345,
		httpPort : 81
	},

	http1_slave : {
		name:'http1_slave',
		type : 'http1',
		httpPort : 82
	},

	http2 : {
		name:'http2',
		type : 'http2',
		httpPort : 83
	}
}