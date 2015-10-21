/**
 * Created by �� on 2015/10/11.
 * 守护进程的API详见README.md
 * TODO ：
 * 如果不需要获取进程的内存 CPU等信息，
 * 并且psModuleList 确实能够完全同步真实的进程状态，
 * 则：getAllProcessStatus 、 getProcessStatus 完全可以直接返回 psModuleList 的信息
 */
'use strict';

var child = require('child_process');
var fs = require('fs');
var psCtrl = require('./lib/processCtrl');
var psConfigList = require('./config/processConfig.json');
var psModuleList = [];

function getAllProcessStatus(req, res, next){
    var platform = process.platform;
    if(platform === 'win32'){
        getProcessStatusByWin32(function(processModuleList){
            res.end(JSON.stringify(processModuleList));
        });
    }else if(platform === 'linux'){
        getProcessStatusByLinux(function(processModuleList){
            res.end(JSON.stringify(processModuleList));
        });
    }
    return next();
}

function getProcessStatus(req, res, next){
    var param = req.params;
    var platform = process.platform;
    if(platform === 'win32'){
        getProcessStatusByWin32(function(processModuleList){
            for(var i = 0; i < processModuleList.length; i++){
                if(processModuleList[i].name == param[0]){
                    res.end(JSON.stringify(processModuleList[i]));
                }
            }
        });
    }else if(platform === 'linux'){
        getProcessStatusByLinux(function(processModuleList){
            for(var i = 0; i < processModuleList.length; i++){
                if(processModuleList[i].name == param[0]){
                    res.end(JSON.stringify(processModuleList[i]));
                }
            }
        });
    }
    return next();
}

function getProcessStatusByWin32(callback){
    var cmd = 'wmic process where name="node.exe" get ProcessId,WorkingSetSize,CommandLine';
    var exec = child.exec(cmd);
    var psList = [];

    exec.stdout.on('data', function (data) {
        var tmpArray = data.split('\n');
        for(var i = 0; i < psModuleList.length; i++){
            if(psModuleList[i]['isValid'] == 0){
                continue;
            }
            var p = {
                'name' : psModuleList[i].name,
                'path' : psModuleList[i].path,
                'pid' : '0',
                'status' : psCtrl.STOP,
                'cpu' : '',
                'mem' : ''
            };
            for(var j = 0; j < tmpArray.length; j++){
                var index = tmpArray[j].indexOf(psModuleList[i]['path']);
                if(index >= 0){
                    var itemArr = tmpArray[j].trim().split(/\s+/);
                    p.pid = itemArr[itemArr.length -2];
                    p.status = psCtrl.RUNNING;
                    p.mem = itemArr[itemArr.length -1];
                }
            }
            psList.push(p);
        }
    });
    exec.stderr.on('data', function (data) {
        console.log(data);
    });
    exec.on('exit', function (code) {
        callback(psList);
    });
}

function getProcessStatusByLinux(callback){
    var cmd = 'ps -aux|grep node';
    var exec = child.exec(cmd);
    var psList = [];

    exec.stdout.on('data', function (data) {
        var tmpArray = data.split('\n');
        for(var i = 0; i < psList.length; i++){
            if(psList[i]['isValid'] == '0'){
                continue;
            }
            var p = {
                'name' : psList[i]['name'],
                'path' : psList[i]['path'],
                'pid' : '0',
                'status' : psCtrl.STOP,
                'cpu' : '',
                'mem' : ''
            };
            for(var j = 0; j < tmpArray.length; j++){
                var index = tmpArray[j].indexOf(psList[i]['path']);
                if(index >= 0){
                    var itemArr = tmpArray[j].trim().split(/\s+/);
                    p.pid = itemArr[1];
                    p.status = psCtrl.RUNNING;
                }
            }
            psList.push(p);
        }
    });
    exec.stderr.on('data', function (data) {

    });
    exec.on('exit', function (code) {
        callback(psList);
    });
}

function setAllProcessStatus(req, res, next){
    var status = req.params['status'];
    var psList = [];
    for(var i = 0; i < psConfigList.length; i++){
        if(psConfigList[i].isValid == 0) continue;
        ctrlProcess(psConfigList[i].name, status, function(psModule){
            psList.push(psModule);
            res.end(JSON.stringify(psList));
        });
    }
    return next();
}

function setProcessStatus(req, res, next){
    var param = req.params;
    var processName = param['processName'];
    var status = param['status'];
    ctrlProcess(processName, status, function(psModule){
        res.end(JSON.stringify(psModule));
    });
    return next();
}

function ctrlProcess(processName, status, callback){
    var psModule = null;

    for(var i = 0; i < psModuleList.length; i++){
        if(psModuleList[i].name == processName){
            psModule = psModuleList[i];
        }
    }

    if(status == 'start'){
        /**
         * 1. 对于已启动的进程，不进行操作
         * 2. 对于配置中不存在的进程，不进行操作
         */
        if(psModule == null){
            for(var i = 0; i < psConfigList.length; i++){
                if(psConfigList[i].isValid == 1 && psConfigList[i].name == processName){
                    psModule = psCtrl.createProcessModule();
                    for(var prop in psConfigList[i]){
                        psModule[prop] = psConfigList[i][prop];
                    }
                    psModuleList.push(psModule);
                    psCtrl.createPsCtrl().start(psModule, callback);
                    return;
                }
            }
        }else{
            if(psModule.status == psCtrl.STOP){
                psModule.count = psModule.count -1;
                psCtrl.createPsCtrl().start(psModule, callback);
                return;
            }
        }
    }else if(status == 'stop'){
        if(psModule != null && psModule.status == psCtrl.RUNNING){
            psCtrl.createPsCtrl().kill(psModule, callback);
            return;
        }
    }else if(status == 'restart'){
        if(psModule != null && psModule.status == psCtrl.RUNNING){
            psModule.count = 0;
            psCtrl.createPsCtrl().restart(psModule, callback);
            return;
        }
    }
    callback({});
}

function getHelp(req, res, next){
    var apiDoc = require('./config/apiDocument.json');
    //res.writeHead(200, {'Content-Type' : 'application/json'});
    res.end(JSON.stringify(apiDoc));
    next();
}

function getLog(req, res, next){
    var date = req.params.date;
    var logName = '';

    //支持的格式为 YYYYMMDD,YYYY-MM-DD
    var dateReg = /[0-9]{8}/;
    var flg = dateReg.test(date);
    if(flg){
        logName = date.substr(0,4) + '-' + date.substr(4,2) + '-' + date.substr(6,2) + '.log';
    }else{
        dateReg = /([0-9]{4})[-]([0-9]{2})[-]([0-9]{2})/;
        flg = dateReg.test(date);
        if(flg){
            logName = date + '.log';
        }
    }
    if(logName != ''){
        fs.readFile('./log/' + logName, function(err, data){
            if(err){
                console.log(err);
            }else{
                res.end(data);
            }
        });
    }
    next();
}

function getLogList(req, res, next){
    var list = [];
    fs.readdir('./log/', function (err, files) {
        files.forEach(function(file){
            list.push(file);
        });
        res.end(JSON.stringify(list));
    });
    next();
}

exports.init = function (tag) {
    psModuleList = tag;
};

exports.start = function () {
    var restify = require('restify');

    var server = restify.createServer({
        name : 'DaemonServer'
    });

    server.use(restify.queryParser());

    server.use(restify.bodyParser());

    server.use(restify.CORS());

    var PATH = '/api/daemon';

    server.get({path: PATH , version : '0.0.1'}, getHelp);

    server.get({path: PATH + '/process', version : '0.0.1'}, getAllProcessStatus);

    server.get({path: PATH + '/process/:processName', version : '0.0.1'}, getProcessStatus);

    server.put({path: PATH + '/process/:status', version : '0.0.1'}, setAllProcessStatus);

    server.put({path: PATH + '/process/:processName/:status', version : '0.0.1'}, setProcessStatus);

    server.get({path: PATH + '/log/:date', version : '0.0.1'}, getLog);

    server.get({path: PATH + '/log', version : '0.0.1'}, getLogList);

    server.listen('4000', '127.0.0.1', function(){
        console.log('%s listening at %s ', server.name , server.url);
    });
};
