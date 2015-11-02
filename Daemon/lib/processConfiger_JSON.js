/**
 * Created by 霖 on 2015/10/23.
 */

var fs = require('fs');
var path = require('path');
var pathname = path.resolve(__dirname, '../config') + '/processConfig.json';
var processConfigList = [];

exports.getConfigList = function (){
    processConfigList = JSON.parse(fs.readFileSync(pathname));
    return processConfigList;
};

exports.add = function (item) {
    if(!checkType(item)){
        return 'The specified object types do not match';
    }
    processConfigList = JSON.parse(fs.readFileSync(pathname));
    for(var i = 0; i < processConfigList.length; i++){
        if(processConfigList[i]['name'] == item['name']){
            return 'The specified object already exists';
        }
    }
    processConfigList.push(item);
    fs.writeFileSync(pathname, JSON.stringify(processConfigList));
    return 'The specified object has been added';
};

exports.delete = function (name) {
    processConfigList = JSON.parse(fs.readFileSync(pathname));
    for(var i = 0; i < processConfigList.length; i++){
        if(processConfigList[i]['name'] == name){
            processConfigList.splice(i,1);
            fs.writeFileSync(pathname, JSON.stringify(processConfigList));
            return 'The specified object is deleted';
        }
    }
    return 'The specified object does not exist';
};

exports.update = function (item) {
    if(!checkType(item)){
        return 'The specified object types do not match';
    }
    for(var i = 0; i < processConfigList.length; i++){
        if(processConfigList[i]['name'] == item['name']){
            for(var prop in processConfigList[i]){
                processConfigList[i][prop] = item[prop];
            }
            fs.writeFileSync(pathname, JSON.stringify(processConfigList));
            return 'The specified object has been updated';
        }
    }
    return 'The specified object does not exist';
};

function checkType(o){
    if(o.hasOwnProperty('name') && o.hasOwnProperty('path') && o.hasOwnProperty('workingDir') && o.hasOwnProperty('max') &&
        o.hasOwnProperty('sleepTime') && o.hasOwnProperty('isValid') && o.hasOwnProperty('port')){
        return true;
    }else{
        return false;
    }
}

