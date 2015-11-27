/**
 * Created by shk on 15-11-25.
 *
 * 数据库设置--
 * 从xml获取设置的数据库信息
 */
var fs = require('fs');
var xml2js = require('xml2js');

var MYSQLIP='http://localhost:8080';
var APIversion='1.0.0';

//默认测试设置
var FY3DCOSS_DBIP="10.24.141.1";
var FY3DCOSS_DBUser="fy3d";
var FY3DCOSS_DBPassword="fy3d";
var FY3DCOSS_DBPort="3306";

//动态获取赋值
_getDBSetFromXML();
//从xml文件中获取数据库信息
function  _getDBSetFromXML()
{

}


//将修改后的设置保存入xml文件
function  _setDBSetFromXML()
{

}