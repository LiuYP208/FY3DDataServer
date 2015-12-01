/**
 * Created by liuyp on 15-11-30.
 * coss api 功能函数实现js
 */

//根据日期 获取定时作业流计划信息
var getTimingProcessPlan = function (req, res, next) {

    //获取日期
    var dateStr = req.params.date;

    var returnInfo = '获得需求，轨道号：' + stationStr + '，日期：' + dateStr + '。返回计划信息';
    res.send(JSON.stringify(returnInfo));
    res.end(JSON.stringify(returnInfo));
    return;
};

exports._getTimingProcessPlan = getTimingProcessPlan;


//根据日期 获取定时作业流实际状态信息
var getTimingProcessStatus = function (req, res, next) {

    //获取日期
    var dateStr = req.params.date;

    var returnInfo = '获得需求，轨道号：' + stationStr + '，日期：' + dateStr + '。返回计划信息';
    res.send(JSON.stringify(returnInfo));
    res.end(JSON.stringify(returnInfo));
    return;
};

exports._getTimingProcessStatus = getTimingProcessStatus;


//liunode79932750779932750no nodeliatestbug