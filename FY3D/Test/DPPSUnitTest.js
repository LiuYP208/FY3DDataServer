/**
 * Created by liuyp on 15-11-26.
 * DPPS 单元测试
 * 包含API接口测试
 */
var restify = require('restify');

var CommSet = require('../lib/CommonSet.js');

var urlInfo = 'http://' + CommSet._localIP + ':' + CommSet._DPPSPort;

console.log('发送消息至：' + urlInfo);

//new client
var client = restify.createJsonClient({
    url: urlInfo,
    version: '~1.0.0'
});

//test api /fy3d/api/DPPS/ProcessStatus/:date/:orbnum
client.get('/fy3d/api/DPPS/ProcessStatus/20151102/12035', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});


//test api /fy3d/api/DPPS/L1FileQuality/:date/:orbnum/:Instrument
client.get('/fy3d/api/DPPS/L1FileQuality/20150321/12034/MERSI', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});

//test api /fy3d/api/DPPS/L1File/:date/:orbnum/:Instrument
client.get('/fy3d/api/DPPS/L1File/20150203/02154/GNOS', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});