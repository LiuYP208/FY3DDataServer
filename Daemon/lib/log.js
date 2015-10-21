/**
 * Created by fanlin on 9/5/15.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

exports.warning = function(msg){
    writeLog(msg, 'warning')
};

exports.info = function(msg){
    writeLog(msg, 'info')
}

exports.error = function(msg){
    writeLog(msg, 'error');
}

function writeLog(msg, type){
    var date = new Date().toLocaleDateString();
    var pathname = path.resolve(__dirname, '../log');
    var logfilePath = pathname + '/' + date + '.log';
    var o ={
        'type' : type,
        'time' : new Date().toLocaleTimeString(),
        'msg' : msg
    };
    try {
        fs.appendFile(logfilePath, JSON.stringify(o) + ",\r\n", function (err) {
            if (err) {
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err.message);
    }
}
