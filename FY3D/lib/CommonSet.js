/**
 * Created by liuyp on 15-11-26.
 * 监听接口设置
 */

var commonFunc = require('../lib/commonFunc.js');

//服务器名称
var ServerName='FY3D-SystemDataServer';
exports._ServerName = ServerName;

//版本号
var ServerVersion='1.0.0';
exports._ServerVersion = ServerVersion;
//获取本机IP--_localIP
var localIP = commonFunc.getLoacalIP();
exports._localIP = localIP;
console.log(exports._localIP);

//DAS监听端口：8803（8801被占用）--_DASPort
var DASPort = 8803;
exports._DASPort = DASPort;

//DPPS监听端口8802--_DPPSPort
var DPPSPort = 8802;
exports._DPPSPort = DPPSPort;


//COSS 监听端口 8804
var COSSPort = 8804;
exports._COSSPort = COSSPort;

