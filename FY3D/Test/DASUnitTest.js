/**
 * Created by liuyp on 15-11-25.
 * DAS API 接口相关测试
 * 包含
 * 正确url-API测试
 * 错误url-API测试
 * 漏项url-API测试
 *
 */
var restify = require('restify');

var CommSet = require('../lib/CommonSet.js');


var urlInfo = 'http://' + CommSet._localIP + ':' + CommSet._DASPort;

console.log('发送消息至：' + urlInfo);
var client = restify.createJsonClient({
    url: urlInfo,
    version: '~1.0.0'
});

//test api /fy3d/api/System/RecheivePlanNum/:station/:date/:Orbnum
client.get('/fy3d/api/DAS/RecheivePlanNum/SM/20151122/10221', function (err, req, res, obj) {

    console.log('Server returned: %j', obj);
});

client.get('/fy3d/api/DAS/RecheivePlanNum1/SM/20151122/10221', function (err, req, res, obj) {

    console.log('Server returned: %j', obj);
});

client.get('/fy3d/api/DAS/RecheivePlanNum//20151122/10221', function (err, req, res, obj) {

    console.log('Server returned: %j', obj);
});

//test api /fy3d/api/System/RecheiveActualNum/:station/:date/:Orbnum
client.get('/fy3d/api/DAS/RecheiveActualNum/SM/20151212/10221', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});


//test api /fy3d/api/System/RecheiveFilelist/:station/:date/:Orbnum
client.get('/fy3d/api/DAS/RecheiveFilelist/SM/20151212/10221', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});


//test api /fy3d/api/System/RecheiveFileQuality/:station/:date/:Orbnum
client.get('/fy3d/api/DAS/RecheiveFileQuality/SM/20151212/10221', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});

//test api /fy3d/api/System/HardwareInfo
client.get('/fy3d/api/DAS/HardwareInfo', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});