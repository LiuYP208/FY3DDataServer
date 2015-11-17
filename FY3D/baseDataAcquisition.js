/**
 * Created by fanlin on 2015/11/07
 * Basic data acquisition
 * １、IFLAllSatPassTimeyyyyMMdd.xml
 * ２、
 */

(function () {
	var ftp = require('ftp');
	var fs = require('fs');
	var path = require('path');
	var net = require('net');
	var Timer = require('./lib/commonFunc.js').timer;
	var log = require('./lib/log.js');

	var server = net.createServer(function (client) {
		client.on('data', function (data) {
			var str = data.toString('utf8', 0, data.lenght);
			var filenameReg = /IFLAllSatPassTime[0-9]{8}.xml/;
			var regResult = filenameReg.test(str);
			if (regResult) {
				var timeTableName = str;
				var localTimeTablePath = path.resolve(__dirname, './data/timetable/');
				_downloadTimeTable(localTimeTablePath, timeTableName, function (err) {
					if (err) {
						log.error('baseDataAcquisition', 'Re-DownloadTimeTable failed, TimeTable: ' + timeTableName);
					} else {
						log.info('baseDataAcquisition', 'Re-DownloadTimeTable success, TimeTable: ' + timeTableName);
					}
				});
			}
		});
		client.on('err', function () {

		});
	});
	server.listen(4000);
	
	/**
	 * 时间表下载，定时轮询，当满足条件时，下载时间表文件 
	 * 规则：每天定时下载　２３：５８分　下载第二天的时间表。
	 */
	var timeTableTimer = new Timer(60000);
	timeTableTimer.start();
	timeTableTimer.on('tick', function () {
		var Now = new Date();
		var HH = Now.getHours();
		var mm = Now.getMinutes();
		var yyyy = Now.getFullYear();
		var MM = Now.getMonth();
		var dd = Now.getDate();
		var timeTableName = 'IFLAllSatPassTime' + yyyy + MM + dd + '.xml';
		var timeTablePath = path.resolve(__dirname, './data/timetable/');
		if ((mm == 58) && HH == 23) {
		//if (mm % 3 == 0) {
			_downloadTimeTable(timeTablePath, timeTableName, function (err) {
				if (err) {
					log.error('baseDataAcquisition', 'DownloadTimeTable failed, TimeTable: ' + timeTableName);
				} else {
					log.info('baseDataAcquisition', 'DownloadTimeTable success, TimeTable: ' + timeTableName);
				}
			});
		}
	});

	/**
	 * 下载时间表文件
	 */
	function _downloadTimeTable(timeTablePath, timeTableName, callback) {
		
		//TODO: 下载时间表文件
		var client = new ftp();
		client.on('ready', function () {
			client.get('../../../OCSDATA/ORB/SPT/' + timeTableName, function (err, stream) {
				if (err) {
					callback(err);
					return;
				};
				stream.once('close', function () {
					client.end();
				});
				stream.pipe(fs.createWriteStream(timeTablePath + '/' + timeTableName));
				callback();
			});
		});
		client.on('error', function (err) {
			console.log(err);
		});
		client.connect({
			user: 'OCSRUN',
			password: '123',
			host: '10.24.170.242',
			port: 21
		});
	}
})();