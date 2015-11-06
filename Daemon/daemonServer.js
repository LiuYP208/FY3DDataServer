/**
 * Created by 范霖 on 2015/10/11.
 * 守护进程的API详见README.md
 * TODO ：
 * 如果不需要获取进程的内存 CPU等信息，
 * 并且psModuleList 确实能够完全同步真实的进程状态，
 * 则：getAllProcessStatus 、 getProcessStatus 完全可以直接返回 psModuleList 的信息
 */
'use strict';

var child = require('child_process');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');
var path = require('path');
var commonFunc = require('./lib/commonFunc')
var psCtrl = require('./lib/processCtrl');
var configer = require('./lib/processConfiger_JSON');
var psConfigList = require('./config/processConfig.json');
var psModuleList = [];


function DaemonServer() {
    EventEmitter.call(this);

    var self = this;

    var localIP = commonFunc.getLoacalIP();

    this.init = function (tag) {
        psModuleList = tag;
    };

    this.start = function () {

        var restify = require('restify');

        var server = restify.createServer({
            name: 'DaemonServer'
        });

        server.use(restify.queryParser());

        server.use(restify.bodyParser());

        server.use(restify.CORS());

        var PATH = '/api/daemon';

        //获取帮助信息
        server.get({ path: PATH, version: '0.0.1' }, _getHelp);

        //获取指定进程的帮助信息
        server.get({ path: PATH + '/processhelp/:name', version: '0.0.1' }, _getProcessHelp);
        
        //获取进程列表  
        server.get({ path: PATH + '/processhelp', version: '0.0.1' }, _getProcessList);

        //查询所有进程的状态
        server.get({ path: PATH + '/process', version: '0.0.1' }, _getAllProcessStatus);

        //查询单个进程的状态
        server.get({ path: PATH + '/process/:processName', version: '0.0.1' }, _getProcessStatus);

        //设置所有进程的状态（status：start、stop、restart）
        server.put({ path: PATH + '/setprocess/:status', version: '0.0.1' }, _setAllProcessStatus);

        //设置指定进程的状态（status：start、stop、restart）
        server.put({ path: PATH + '/setprocess/:processName/:status', version: '0.0.1' }, _setProcessStatus);

        //读取日志信息
        server.get({ path: PATH + '/log/:date', version: '0.0.1' }, _getLog);

        //获取日志文件列表
        server.get({ path: PATH + '/log', version: '0.0.1' }, _getLogList);

        //刷新配置
        server.get({ path: PATH + '/config/refresh', version: '0.0.1' }, _refreshConfig);

        //插入配置
        server.put({ path: PATH + '/config/insert', version: '0.0.1' }, _insertObj);

        //更新配置
        server.put({ path: PATH + '/config/update', version: '0.0.1' }, _updateObj);

        //删除配置
        server.put({ path: PATH + '/config/delete/:name', version: '0.0.1' }, _deleteObj);

        server.listen('4000', localIP, function () {
            console.log('%s listening at %s ', server.name, server.url);
        });
    };

    function _getAllProcessStatus(req, res, next) {
        var platform = process.platform;
        if (platform === 'win32') {
            _getProcessStatusByWin32(function (processModuleList) {
                res.end(JSON.stringify(processModuleList));
            });
        } else if (platform === 'linux') {
            _getProcessStatusByLinux(function (processModuleList) {
                res.end(JSON.stringify(processModuleList));
            });
        }
        return next();
    }

    function _getProcessStatus(req, res, next) {
        var name = req.params.processName;
        var platform = process.platform;
        if (platform === 'win32') {
            self._getProcessStatusByWin32(function (processModuleList) {
                for (var i = 0; i < processModuleList.length; i++) {
                    if (processModuleList[i].name == name) {
                        res.end(JSON.stringify(processModuleList[i]));
                        return next();
                    }
                }
                res.end('查无此进程！');
                return next();
            });
        } else if (platform === 'linux') {
            _getProcessStatusByLinux(function (processModuleList) {
                for (var i = 0; i < processModuleList.length; i++) {
                    if (processModuleList[i].name == name) {
                        res.end(JSON.stringify(processModuleList[i]));
                        return next();
                    }
                }
                res.end('查无此进程！');
                return next();
            });
        }
    }

    function _setAllProcessStatus(req, res, next) {
        var status = req.params['status'];
        var psList = [];
        for (var i = 0; i < psConfigList.length; i++) {
            if (psConfigList[i].isValid == 0) continue;
            self._ctrlProcess(psConfigList[i].name, status, function (psModule) {
                psList.push(psModule);
                res.end(JSON.stringify(psList));
            });
        }
        return next();
    }

    function _setProcessStatus(req, res, next) {
        var param = req.params;
        var processName = param['processName'];
        var status = param['status'];
        _ctrlProcess(processName, status, function (psModule) {
            res.end(JSON.stringify(psModule));
        });
        return next();
    }

    function _ctrlProcess(processName, status, callback) {
        var psModule = null;

        for (var i = 0; i < psModuleList.length; i++) {
            if (psModuleList[i].name == processName) {
                psModule = psModuleList[i];
            }
        }

        if (status == 'start') {
            /**
             * 1. 对于已启动的进程，不进行操作
             * 2. 对于配置中不存在的进程，不进行操作
             */
            if (psModule == null) {
                for (var i = 0; i < psConfigList.length; i++) {
                    if (psConfigList[i].isValid == 1 && psConfigList[i].name == processName) {
                        psModule = psCtrl.createProcessModule();
                        for (var prop in psConfigList[i]) {
                            psModule[prop] = psConfigList[i][prop];
                        }
                        psModuleList.push(psModule);
                        psCtrl.createPsCtrl().start(psModule, callback);
                        return;
                    }
                }
            } else {
                if (psModule.status == psCtrl.STOP) {
                    psModule.count = psModule.count - 1;
                    psCtrl.createPsCtrl().start(psModule, callback);
                    return;
                }
            }
        } else if (status == 'stop') {
            if (psModule != null && psModule.status == psCtrl.RUNNING) {
                psCtrl.createPsCtrl().kill(psModule, callback);
                return;
            }
        } else if (status == 'restart') {
            if (psModule != null && psModule.status == psCtrl.RUNNING) {
                psModule.count = 0;
                psCtrl.createPsCtrl().restart(psModule, callback);
                return;
            }
        }
        callback({});
    }

    function _getHelp(req, res, next) {
        var apiDoc = require('./config/apiDocument.json');
        //res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(apiDoc));
        return next();
    }

    function _getLog(req, res, next) {
        var date = req.params.date;
        var logName = '';

        //支持的格式为 YYYYMMDD,YYYY-MM-DD
        var dateReg = /[0-9]{8}/;
        var flg = dateReg.test(date);
        if (flg) {
            logName = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + '.log';
        } else {
            dateReg = /([0-9]{4})[-]([0-9]{2})[-]([0-9]{2})/;
            flg = dateReg.test(date);
            if (flg) {
                logName = date + '.log';
            }
        }
        if (logName != '') {
            fs.readFile('./log/' + logName, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.end(data);
                }
            });
        }
        return next();
    }

    function _getLogList(req, res, next) {
        var list = [];
        fs.readdir('./log/', function (err, files) {
            files.forEach(function (file) {
                list.push(file);
            });
            res.end(JSON.stringify(list));
        });
        return next();
    }

    function _refreshConfig(req, res, next) {
        var configList = configer.getConfigList();
        res.end(JSON.stringify(configList));
        self.emit('refresh', configList);
        next();
    }

    function _insertObj(req, res, next) {
        var str = configer.add(req.body);
        res.end(str);
        next();
    }

    function _updateObj(req, res, next) {
        var str = configer.update(req.body);
        res.end(str);
        next();
    }

    function _deleteObj(req, res, next) {
        var name = req.params.name;
        var str = configer.delete(name);
        res.end(str);
        next();
    }

    function _getProcessStatusByWin32(callback) {
        var cmd = 'wmic process where name="node.exe" get ProcessId,WorkingSetSize,CommandLine';
        var exec = child.exec(cmd);
        var psList = [];

        exec.stdout.on('data', function (data) {
            var tmpArray = data.split('\n');
            for (var i = 0; i < psModuleList.length; i++) {
                if (psModuleList[i]['isValid'] == 0) {
                    continue;
                }
                var p = {
                    'name': psModuleList[i].name,
                    'path': psModuleList[i].path,
                    'pid': '0',
                    'status': psCtrl.STOP,
                    'cpu': '',
                    'mem': ''
                };
                for (var j = 0; j < tmpArray.length; j++) {
                    var index = tmpArray[j].indexOf(psModuleList[i]['path']);
                    if (index >= 0) {
                        var itemArr = tmpArray[j].trim().split(/\s+/);
                        p.pid = itemArr[itemArr.length - 2];
                        p.status = psCtrl.RUNNING;
                        p.mem = itemArr[itemArr.length - 1];
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

    function _getProcessStatusByLinux(callback) {
        var cmd = 'ps -aux|grep node';
        var exec = child.exec(cmd);
        var dataStr = '';
        var psList = [];

        exec.stdout.on('data', function (data) {
            dataStr = dataStr + data;
        });
        exec.stderr.on('data', function (data) {

        });
        exec.on('exit', function (code) {
            var tmpArray = dataStr.split('\n');
            for (var i = 0; i < psModuleList.length; i++) {
                if (psModuleList[i]['isValid'] == '0') {
                    continue;
                }
                var p = {
                    'name': psModuleList[i]['name'],
                    'path': psModuleList[i]['path'],
                    'pid': '0',
                    'status': psCtrl.STOP,
                    'cpu': '',
                    'mem': ''
                };
                for (var j = 0; j < tmpArray.length; j++) {
                    var index = tmpArray[j].indexOf(psModuleList[i]['path']);
                    if (index >= 0) {
                        var itemArr = tmpArray[j].trim().split(/\s+/);
                        p.pid = itemArr[1];
                        p.status = psCtrl.RUNNING;
                    }
                }
                if (!_contains(psList, p)) {
                    psList.push(p);
                } else {
                    for (var prop in psList[i]) {
                        psList[i][prop] = p[prop];
                    }
                }
            }
            callback(psList);
        });
    }

    function _contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].name === obj.name) {
                return true;
            }
        }
        return false;
    }

    function _getProcessHelp(req, res, next) {
        var name = req.params.name;
        var mdPath = '';
        for (var i = 0; i < psModuleList.length; i++) {
            if (psModuleList[i].name == name) {
                mdPath = path.dirname(psModuleList[i].path) + '/md/' + psModuleList[i].name + '.md';
                break;
            }
        }
        if (mdPath != '') {
            fs.exists(mdPath, function (isExist) {
                if (isExist) {
                    fs.readFile(mdPath, function (err, content) {
                        if (err) {
                            //res.end(err);
                            next(err);
                        } else {
                            res.end(content.toString());
                            next();
                        }
                    });
                } else {
                    res.end('进程说明文档不存在。');
                    next();
                }
            });
        } else {
            res.end('进程不存在。');
            next();
        }
    }

    function _getProcessList(req, res, next) {
        var psList = [];
        for (var i = 0; i < psModuleList.length; i++) {
            psList.push(psModuleList[i].name);
        }
        res.end(JSON.stringify(psList));
        next();
    }
}



util.inherits(DaemonServer, EventEmitter);

exports.createDaemonServer = function () {
    return new DaemonServer();
};

