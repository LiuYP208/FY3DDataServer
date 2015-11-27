/**
 * Created by shk on 15-11-24.
 * 测试TimeTAble Listen
 *

 var Port =4002;
var Host='127.0.0.1';
var dgram=require('dgram');
var message=new Buffer('test1');
var client=dgram.createSocket('udp4');
client.send(message,0,message.length,4000,Host,function(err){
    if(err) throw err;
    console.log('udp message send!')
    client.close();
});
 */
//测试获取时间表版本

var assert = require('assert');
var restify = require('restify');

var client = restify.createJsonClient({
    url: 'http://localhost:8080',
    version: '~1.0.0'
});
/*
client.get('/fy3d/api/basedata/timetable/20150924', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
})
*/

client.get('/fy3d/api/System/RecheivePlan/SM/20151112/10221', function (err, req, res, obj) {
    //assert.ifError(err);
    console.log('Server returned: %j', obj);
});