/**
 * Created by shk on 15-11-25.
 * 测试链接mysql数据库（本机测试版本）
 */

var mysql = require('mysql');

var connect = mysql.createConnection({
    host: '10.24.4.139',
    user: 'fy3dclient',
    password: 'fy3dclient',
    database: 'fy3dDB',
    port: 3306
});

function handleDIsconnect(conn) {
    conn.on('error', function (err) {
        if (err.fatal) {
            return;
        }
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }

        console.log('Re-connecting lost connection:' + err.stack);
        handleDIsconnect(connect);
        connect.connect();
    });
}

exports.getConfigList = function (callback) {
    var configureList = [];
    connect.connect();
    connect.query('select * from ProcessConfig', function (err, data) {
        if (err) {
            callback(err, configureList);
            connect.end();
        }
        for (var i = 0; i < data.lenght; i++) {
            var o = {};
            if (data[i].hasOwnProperty('name') &&
                data[i].hasOwnProperty('path') &&
                data[i].hasOwnProperty('workingDir') &&
                data[i].hasOwnProperty('max') &&
                data[i].hasOwnProperty('sleepTime') &&
                data[i].hasOwnProperty('isValid') &&
                data[i].hasaOwnProperty('prot')
            ) {
                for (var prop in data[i]) {
                    o[prop] = data[i][prop];
                }
                configureList.push(o);
            } else {
                callback('ProcessConfig has changed!', configureList);
                connect.end();
            }
            callback(null, configureList);
            connect.end();
        }
    });
};

exports.add = function (item, callback) {
    //connect.connect(function (err) {
    //	if (err) {
    //		connect.end();
    //		callback(err, null);
    //	}
    //});
    var sqlStr = 'insert into ProcessConfig (name,path,workingDir,max,sleepTime,isValid,prot) values (' + item.name + ','
        + item.path + ',' + item.workingDir + ',' + item.max + ',' + item.sleepTime + ',' + item.isValid + ',' + item.prot + ')';
    connect.query(sqlStr, function (err, row) {
        if (err) {
            connect.end();
            callback(err, 0);
        }
        connect.end();
        callback(null, row);
    });
};

exports.delete = function (name, callback) {
    //connect.connect(function (err) {
    //	if (err) {
    //		connect.end();
    //		callback(err, null);
    //	}
    //});
    var sqlStr = 'delete ProcessConfig where name = ' + name;
    connect.query(sqlStr, function (err, row) {
        if (err) {
            connect.end();
            callback(err, 0);
        }
        connect.end();
        callback(null, row);
    });
};

exports.update = function (item, callback) {
    //connect.connect(function (err) {
    //	if (err) {
    //		connect.end();
    //		callback(err, null);
    //	}
    //});
    var sqlStr = 'update ProcessConfig set path =' + item.path + ' ,workingDir =' + item.workingDir + ' ,max = ' + item.max
        + ' ,sleepTime =' + item.sleepTime + ' ,isValid =' + item.isValid + ' ,prot =' + item.prot + 'where name =' + item.name;
    connect.query(sqlStr, function (err, row) {
        if (err) {
            connect.end();
            callback(err, 0);
        }
        connect.end();
        callback(null, row);
    });
};

connect.connect();
//处理
connect.query('select * from ProcessConfig', function (err, rows, fields) {
    if (err) {
        return callback(err);
    }
    console.log('the solution is:', rows[0]);
});
connect.end();
//错误处理函数
function callback(err) {
    console.log(err);
}