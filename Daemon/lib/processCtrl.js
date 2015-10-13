/**
 * Created by 霖 on 2015/10/11.
 */

var child = require('child_process');
var RUNNING = 1;
var STOP = 2;
var UNRUNNING = 0;

exports.RUNNING = RUNNING;
exports.STOP = STOP;
exports.UNRUNNING = UNRUNNING;

exports.createPsCtrl = function(){
    return new ProcessCtrl();
};

exports.createProcessModule = function () {
    return new ProcessModule();
};

function ProcessCtrl(){};
ProcessCtrl.prototype.start = start;
ProcessCtrl.prototype.kill = kill;
ProcessCtrl.prototype.restart = restart;
function start(processModule){
    var ls = child.spawn('node',[processModule['path'], processModule['port']]);
    if(ls.pid != 0){
        processModule.pid = ls.pid;
        processModule.status = RUNNING;
        processModule.count++;
        console.log('process \"' + processModule['name'] + "\" start, run count:" + processModule.count);
    }
    ls.on('exit', function (code){
        //输出错误码
        console.log("exit code:" + code);
        //重新启动脚本
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
}
function kill(processModule){
    child.exec('kill -9 ' + processModule.pid);
    processModule.status = STOP;
}
function restart(processModule){
    var ls = child.exec('kill -9 ' + processModule.pid);
    processModule.status = STOP;
    ls.on('exit', function(code){
        start(processModule);
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