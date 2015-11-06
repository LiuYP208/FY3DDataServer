/**
 * Created by 范霖 on 2015/11/02.
 * FY3D 基础数据提供服务
 */

(function () {
	var restify = require('restify');
	var commonFunc = require('./lib/commonFunc');
	
	var port = process.argv[2];
	var localIP = commonFunc.getLoacalIP();
	var server = restify.createServer({
		name: 'FY3D-BaseDataServer'
	});
	server.use(restify.queryParser());
	server.use(restify.bodyParser());
	server.use(restify.CORS());

	var self = this;
	var PATH = '/fy3d/api/basedata/';

	/**
	 * 返回api列表
	 */
	server.get({ path: PATH, version: '0.0.1' }, _getHelp);
	
	
	 server.listen(port, localIP, function () {
            console.log('%s listening at %s ', server.name, server.url);
        });
	
	function _getHelp (req, res, next) {
		var apiDoc = require('./apijson/baseDataServer.md');
		//res.end(JSON.stringify(apiDoc));
		next();
	}
	
})();