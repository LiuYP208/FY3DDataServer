/**
 * Created by liuyp on 15-11-25.
 * DAS相关API
 * 预计接收数量
 * 实际接收数量
 * 接收文件列表
 * 接收文件质量
 * 接收硬件信息
 * 接收错误排查---待补充
 */


var restify = require('restify')
//基础监听设置等
var CommSet = require('../lib/CommonSet.js');
var server = restify.createServer({
    name: CommSet._ServerName,
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


//DAS数据接收API
var das = require('/DASDataFunc.js');

//DAS按站点，按时间，按轨道-预计接收数量
server.get('/fy3d/api/DAS/RecheivePlanNum/:station/:date/:Orbnum', das._getDasPlan);

/*DAS按站点，按时间，按轨道-实际接收数量*/
server.get('/fy3d/api/DAS/RecheiveActualNum/:station/:date/:Orbnum', das._getDasActual);

//DAS接收文件详细信息列表
server.get('/fy3d/api/DAS/RecheiveFilelist/:station/:date/:Orbnum', das._getDasFileList);

//DAS接收文件质量汇总信息--成功率，误码数等
server.get('/fy3d/api/DAS/RecheiveFileQuality/:station/:date/:Orbnum', das._getDasFileQuality);

//DAS接收硬件状态最新信息--各个天线 调制解调器等
server.get('/fy3d/api/System/HardwareInfo', das._getDasHardwareInfo);


//开启监听
server.listen(CommSet._DASPort, CommSet._localIP, function () {

    console.log('%s  listening at %s', server.name,  server.url);
});

