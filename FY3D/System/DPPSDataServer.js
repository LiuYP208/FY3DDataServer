/**
 * Created by liuyp on 15-11-26.
 *
 * DPPS数据获取api+ 测试监听（最终监听计划待仪）
 */
var restify = require('restify');

//基础监听设置等
var CommSet = require('../lib/CommonSet.js');

//创建Server
var server = restify.createServer({
    name: CommSet._ServerName,
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


//DPPS数据接收API
var dpps = require('../System/DPPSDataFunc.js');

//DPPS作业流状态--日期 轨道号
server.get('/fy3d/api/DPPS/ProcessStatus/:date/:orbnum', dpps._getDPPSFlowInfo);

//DPPS生成文件质量信息--日期 轨道号 仪器名称
server.get('/fy3d/api/DPPS/L1FileQuality/:date/:orbnum/:Instrument', dpps._getDPPSL0Quality);

//DPPS生成文件信息--日期 轨道号 仪器名称
server.get('/fy3d/api/DPPS/L1File/:date/:orbnum/:Instrument', dpps._getDPPSL0File);


//开启监听
server.listen(CommSet._DPPSPort, CommSet._localIP, function () {
    console.log('%s listening at %s', server.name, server.url);
});