/**
 * Created by liuyp on 15-11-25.
 *
 * DAS api 函数实现文件
 */

//根据日期 轨道号 站点对DAS的接收计划
var getDasPlan = function (req, res, next) {

    //获取日期
    var dateStr = req.params.date;
    //获取站点
    var stationStr = req.params.station;
    //获取轨道号
    var orbnumStr = req.params.Orbnum;
    var returnInfo = '获得需求，轨道号：' + orbnumStr + '，站点：' + stationStr + '，日期：' + dateStr + '。返回计划信息';
    res.send(JSON.stringify(returnInfo));
    res.end(JSON.stringify(returnInfo));
    return;
}
exports._getDasPlan=getDasPlan;

//根据日期 轨道号 站点对DAS的接收实际情况
var getDasActual = function (req, res, next) {

    //获取日期
    var dateStr = req.params.date;
    //获取站点
    var stationStr = req.params.station;
    //获取轨道号
    var orbnumStr = req.params.Orbnum;
    //to be continue
    var timeTableName = '获得需求，轨道号：' + orbnumStr + '，站点：' + stationStr + '，日期：' + dateStr + '。返回实际信息';
    res.send(JSON.stringify(timeTableName));
    res.end(JSON.stringify(timeTableName));
    return;
}

exports._getDasActual=getDasActual;


//根据日期 轨道号 站点对DAS的接收实际文件列表
var getDasFileList = function (req, res, next) {

    //获取日期
    var dateStr = req.params.date;
    //获取站点
    var stationStr = req.params.station;
    //获取轨道号
    var orbnumStr = req.params.Orbnum;
    //to be continue
    var timeTableName = '获得需求，轨道号：' + orbnumStr + '，站点：' + stationStr + '，日期：' + dateStr + '。返回实际文件列表信息';
    res.send(JSON.stringify(timeTableName));
    res.end(JSON.stringify(timeTableName));
    return;
}

exports._getDasFileList=getDasFileList;



//根据日期 轨道号 站点对DAS的接收实际文件质量信息
var getDasFileQuality = function (req, res, next) {

    //获取日期
    var dateStr = req.params.date;
    //获取站点
    var stationStr = req.params.station;
    //获取轨道号
    var orbnumStr = req.params.Orbnum;
    //to be continue
    var timeTableName = '获得需求，轨道号：' + orbnumStr + '，站点：' + stationStr + '，日期：' + dateStr + '。返回实际文件质量信息';
    res.send(JSON.stringify(timeTableName));
    res.end(JSON.stringify(timeTableName));
    return;
}

exports._getDasFileQuality=getDasFileQuality;


//根据日期 轨道号 站点获取 DAS的接收设备硬件信息
var getDasHardwareInfo = function (req, res, next) {

    //to be continue
    var timeTableName = '获得需求。返回最新DAS硬件状态信息';
    res.send(JSON.stringify(timeTableName));
    res.end(JSON.stringify(timeTableName));
    return;
}

exports._getDasHardwareInfo=getDasHardwareInfo;
