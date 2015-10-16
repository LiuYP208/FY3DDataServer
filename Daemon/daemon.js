/**
 * Created by 霖 on 2015/10/10.
 * 与配置文件（数据库/文件）配合 维护相关进程的启停。包括如下两方面的功能：
 * 1. 进程守护功能
 * 2. 对外服务功能（RESTfulServer 包括查看、控制、帮助等）
 *      - 守护进程的API包括功能详见README.md
 * 3. 运行日志记录与管理
 * PS: 目前采用JSON文件保存进程配置信息。未来或许会改为以数据库方式存储。
 */

'use strict';

var psCtrl = require('./lib/processCtrl');
var restServer = require('./daemonServer');
var http = require('http');
var processModuleList = []; //进程对象列表,在readProcessConfig（）中初始化


start();

function start(){
    daemon();
    daemonServer();
};

/**
 * 实现进程守护功能.
 */
function daemon(){
    initDaemon();
    startDaemon();
};

/**
 * 初始化守护进程
 * 1.读取进程配置信息；
 * 2.生成用于记录进程状态的 processModule 列表
 * ...
 */
function initDaemon() {
    var processList = readProcessConfig();
    createProcessModuleList(processList);
};

/**
 * 读取进程配置文件
 * 供 createProcessModuleList() 使用
 * 目前采用JSON文件保存进程配置信息。未来或许会改为以数据库方式存储。
 * @returns {*}
 */
function readProcessConfig(){
    var processList = require('./config/processConfig.json');
    return processList;
}

/**
 * 创建进程对象列表
 * processModule ：记录进程状态的对象
 *  - name 进程名
 *  - path 进程实际或相对路径
 *  - workingDir 进程工作目录
 *  - max 进程最大重启次数（包括首次启动）如果 = 0 表示无限次重启
 *  - sleepTime 进程重启间隔
 *  - isValid 是否有效 1 = 有效； 0 = 无效
 *  - port 进程使用TCP时分配的端口号
 *  - count 进程重启次数
 *  - pid 进程id
 *  - status 进程当前状态 (0 = unrunning; 1 = running; 2 = stop)
 */
function createProcessModuleList(processList) {
    for(var i = 0; i < processList.length; i++){
        if(processList[i].hasOwnProperty('isValid') && processList[i]['isValid'] === '1'){

            //创建进程对象
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
 * 启动守护进程
 *
 */
function startDaemon() {
    for(var i = 0; i < processModuleList.length; i++){
        if(processModuleList[i].isValid == 1){
            psCtrl.createPsCtrl().start(processModuleList[i]);
        }
    }
}

/**
 * 守护进程的服务功能
 */
function daemonServer(){
    restServer.init(processModuleList);
    restServer.start();
}
