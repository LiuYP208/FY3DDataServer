/**
 * Create by fanlin on 2015/11/17.
 * 提供时间表相关服务
 * １．定时下载时间表
 * ２．数据服务
 * 		ａ、获取时间表内容；
 * 		ｂ、根据指令下载对应的时间表；
 */

(function ()　{	
	var restify = require('restify');
	var fs = require('fs');
	var path = require('path');
	var xml2js = require('xml2js');
	var commonFunc = require('./lib/commonFunc');	

	var self = this;
	var port = (process.argv[2]) ? process.argv[2] : 4002;
	var localIP = commonFunc.getLoacalIP();
	var server = restify.createServer({
		name: 'FY3D-BaseDataServer'
	});
	server.use(restify.queryParser());
	server.use(restify.bodyParser());
	server.use(restify.CORS());
	
	var PATH = '/fy3d/api/basedata';

	/**
	 * 获取时间表
	 */
	server.get({ path: PATH + '/timetable/:date', version: '0.0.1' }, _getTimeTable);

	server.listen(port, localIP, function () {
		console.log('%s listening at %s ', server.name, server.url);
	});

	function _getTimeTable(req, res, next) {
		var dateStr = req.params.date;
		var NAME = 'IFLAllSatPassTime';
		var PATH = path.resolve(__dirname, './data/timetable');
		var timeTableName = PATH + '/' + NAME + dateStr + '.xml';
		var parseString = xml2js.parseString;
		fs.exists(timeTableName, function (isExist) {
			if (isExist) {
				var xml = fs.readFileSync(timeTableName).toString();
				parseString(xml, function (err, data) {
					if (err) throw err;
					res.end(JSON.stringify(data));
					next(err);
				});
			} else {
				res.end('查无此文件！');
			}
		});
	}
	
	
	
})();