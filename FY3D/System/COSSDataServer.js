/**
 * Created by liuyp on 15-11-30.
 *
 * DPPS数据获取api+ 测试监听
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


//COSS数据接收API
var coss = require('../System/COSSDataFunc.js');

//COSS---定时作业计划信息获取
//
server.get('/fy3d/api/COSS/TimingProcessPlan/:date', coss._getTimingProcessPlan);

//COSS--定时作业流状态获取
server.get('/fy3d/api/DPPS/TimingProcessStatus/:date', coss._getTimingProcessStatus);

//COSS--生成文件信息--日期 轨道号 仪器名称
//server.get('/fy3d/api/DPPS/L1File/:date/:orbnum/:Instrument', coss._getDPPSL0File);


//开启监听
server.listen(CommSet._COSSPort, CommSet._localIP, function () {
    console.log('%s listening at %s', server.name, server.url);
});