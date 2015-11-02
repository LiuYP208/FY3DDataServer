/**
 * Created by ?? on 2015/10/10.
 * Daemon 守护模块
 * 与配置文件（数据库/文件）配合 维护相关进程的启停。包括如下三个方面
 * 1. 进程守护功能
 * 2. 对外服务功能；（RESTfulServer 包括查看、控制、帮助等）
 * 3. 运行日志记录与管理
 */

'use strict';

var psCtrl = require('./lib/processCtrl');
var log = require('./lib/log');
var configer = require('./lib/processConfiger_JSON');
var restServer = require('./daemonServer');
var http = require('http');
var processModuleList = []; //进程状态列表


start();

function start(){
    daemon();
    daemonServer();
};

/**
 * 守护进程.
 */
function daemon(){
    log.info('daemon', 'daemon start');
    initDaemon();
    startDaemon();
};

/**
 * 初始化守护进程
 * 1.读取配置文件
 * 2.生成进程状态列表
 * ...
 */
function initDaemon() {
    var processList = readProcessConfig();
    createProcessModuleList(processList);
};

/**
 * 读取配置文件
 * @returns {*}
 */
function readProcessConfig(){
    var processList = configer.getConfigList();
    return processList;
}

/**
 * 创建进程状态列表
 * processModule 进程状态对象
 *  - name 进程名
 *  - path 路径
 *  - workingDir 工作路径
 *  - max 最大重启次数， max=0 表示始终重启
 *  - sleepTime 重启等待时间
 *  - isValid 有效性标志 1 = 有效 0 = 无效
 *  - port 端口号
 *  - count 重启计数
 *  - pid processID
 *  - status 进程状态 (0 = unrunning; 1 = running; 2 = stop)
 */
function createProcessModuleList(processList) {
    for(var i = 0; i < processList.length; i++){
        if(processList[i].hasOwnProperty('isValid') && processList[i]['isValid'] === '1'){

            //创建processModule对象
            if(!processList[i].hasOwnProperty('name') || !processList[i].hasOwnProperty('path')){
                continue;
            }
            var processModule = psCtrl.createProcessModule();
            for(var prop in processList[i]){
                processModule[prop] = processList[i][prop];
            }

            processModuleList.push(processModule);
        }
    }
}

/**
 * 根据processModuleList启动进程
 */
function startDaemon() {
    for(var i = 0; i < processModuleList.length; i++){
        if(processModuleList[i].isValid == 1){
            psCtrl.createPsCtrl().start(processModuleList[i]);
        }
    }
}

/**
 * 守护服务
 */
function daemonServer(){
    var server = restServer.createDaemonServer();
    server.init(processModuleList);
    server.start();
    server.on('refresh', function (configList) {
        //根据跟新后的列表重新生成processModuleList
    });
}