/**
 * Created by 霖 on 2015/10/11.
 */

var child = require('child_process');
exports.RUNNING = 1;
exports.STOP = 2;
exports.UNRUNNING = 0;
exports.createPsCtrl = function(){
    return new ProcessCtrl();
}
function ProcessCtrl(){};
ProcessCtrl.prototype.start = start;
ProcessCtrl.prototype.kill = kill;
ProcessCtrl.prototype.restart = restart;
function start(processModule){
    var ls = child.spawn('node',[processModule['path'], processModule['port']]);
    if(ls.pid != 0){
        processModule.pid = ls.pid;
        processModule.status = 1;
        processModule.count++;
        console.log('process \"' + processModule['name'] + "\" start, run count:" + processModule.count);
    }
    ls.on('exit', function (code){
        //输出错误码
        console.log("exit code:" + code);
        //重新启动脚本
        if(processModule.status !== 2) {
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
    processModule.status = 2;
}
function restart(processModule){
    var ls = child.exec('kill -9 ' + processModule.pid);
    processModule.status = 2;
    ls.on('exit', function(code){
        start(processModule);
    });
}