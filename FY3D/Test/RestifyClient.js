/**
 * Created by shk on 15-11-24.
 * restify 测试客户端成功demo
 */
var assert = require('assert');
var restify = require('restify');

var client = restify.createJsonClient({
    url: 'http://localhost:8080',
    version: '~1.0'
});
/*
client.get('/echo/Liuyp', function (err, req, res, obj) {
    assert.ifError(err);
    console.log('Server returned: %j', obj);
});
*/
client.get('/fy3d/api/System/SM/20151112/10221', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});