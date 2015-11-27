/**
 * Created by shk on 15-11-24.
 * restify Server 测试
 */

var restify = require('restify');

var server = restify.createServer({
    name: 'myTest',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/echo/:name', function (req, res, next) {
    res.send(req.params);
    console.log('return:%j'+req.params);
    return next();
});

//DAS数据接收API
var das=require('./DASDataFunc.js');
//预计接收数量
server.get('/fy3d/api/System/RecheivePlan/:station/:date/:Orbnum',  das._getDasPlan);

//实际接收数量
server.get('/fy3d/api/System/RecheiveActual/:station/:date/:Orbnum',  das._getDasActual);


//开启监听
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});

