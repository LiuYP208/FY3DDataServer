/**
 * Created by �� on 2015/10/11.
 */

var child = require('child_process');
var RUNNING = 1;
var STOP = 2;
var UNRUNNING = 0;
var psCtrl = null;

exports.RUNNING = RUNNING;
exports.STOP = STOP;
exports.UNRUNNING = UNRUNNING;

exports.createPsCtrl = function(){
    return (psCtrl) ? psCtrl : new ProcessCtrl();
};

exports.createProcessModule = function () {
    return new ProcessModule();
};

function ProcessCtrl(){};
ProcessCtrl.prototype.start = start;
ProcessCtrl.prototype.kill = kill;
ProcessCtrl.prototype.restart = restart;
function start(processModule, callback){
    var ls = child.spawn('node',[processModule['path'], processModule['port']]);
    if(ls.pid != 0){
        processModule.pid = ls.pid;
        processModule.status = RUNNING;
        processModule.count++;
        console.log('process \"' + processModule['name'] + "\" start, run count:" + processModule.count);
    }
    ls.on('exit', function (code){
        //���������
        console.log("process - " + processModule['name'] + " exit; exit code - " + code);
        //���������ű�
        if(processModule.status !== STOP) {
            if (processModule.count <= processModule.max && processModule.max != "0") {
                setTimeout(start, processModule['sleepTime'], processModule);
            }
            else if (processModule.max == 0) {
                setTimeout(start, processModule['sleepTime'], processModule);
            }
        }
    });
    ls.stdout.on('data', function(data){
        console.log(data.toString());
    });
    if(callback){
        callback(processModule);
    }
}
function kill(processModule, callback){
    var platform = process.platform;
    var cmdStr = '';
    if(platform == 'linux'){
        cmdStr = 'kill -9 ' + processModule.pid;
    }else if(platform == 'win32'){
        cmdStr = 'wmic process where ProcessId="' + processModule.pid + '" call terminate';
    }
    child.exec(cmdStr, function(err, stdout, stderr){
        processModule.status = STOP;
        callback(processModule);
    });
}
function restart(processModule, callback){
    var cmdStr = '';
    var platform = process.platform;
    if(platform == 'linux'){
        cmdStr = 'kill -9 ' + processModule.pid;
    }else if(platform == 'win32'){
        cmdStr = 'wmic process where ProcessId="' + processModule.pid + '" call terminate';
    }
    child.exec(cmdStr, function(error, stdout, stderr){
        processModule.status = STOP;
        start(processModule, callback);
    });
}

function ProcessModule(){
    this.name = '';
    this.path = '';
    this.workingDir = '';
    this.max = 5;
    this.sleepTime = 5000;
    this.isValid = 1;
    this.port = 4001;
    this.count = 0;
    this.pid = 0;
    this.status = UNRUNNING;
}