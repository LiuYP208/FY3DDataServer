/**
 * Created by liuyp on 15-11-26.
 *
 * DPPS数据获取 函数实现
 */

//dpps处理流信息 按照日期，轨道获取--获取全部仪器流
var getDPPSFlowInfo = function (req, res, next) {

    //date
    var dateStr = req.params.date;

    //Orbnum
    var OrbnumStr = req.params.orbnum;

    //to be continue
    var returnInfo = '获得需求：日期：' + dateStr + '轨道号：' + OrbnumStr + '。返回作业流信息。';
    res.send(JSON.stringify(returnInfo));
    res.end(JSON.stringify(returnInfo));
    return;
}
exports._getDPPSFlowInfo = getDPPSFlowInfo;


//dpps处理流结果文件质量（L1文件质量信息？） 按照日期，轨道，仪器名称
var getDPPSL0Quality = function (req, res, next) {

    //date
    var dateStr = req.params.date;

    //Orbnum
    var OrbnumStr = req.params.orbnum;

    //Instrument
    var InstrumentStr = req.params.Instrument;

    //to be continue
    var returnInfo = '获得需求：日期：' + dateStr + '轨道号：' + OrbnumStr + '仪器名：' + InstrumentStr+'。返回L0文件质量信息。';
    res.send(JSON.stringify(returnInfo));
    res.end(JSON.stringify(returnInfo));
    return;
}
exports._getDPPSL0Quality = getDPPSL0Quality;


//dpps处理流结果文件质量（L1文件质量信息？） 按照日期，轨道，仪器名称
var getDPPSL0File = function (req, res, next) {

    //date
    var dateStr = req.params.date;

    //Orbnum
    var OrbnumStr = req.params.orbnum;

    //Instrument
    var InstrumentStr = req.params.Instrument;

    //to be continue 从ftp获得文件
    var returnInfo = '获得需求：日期：' + dateStr + '轨道号：' + OrbnumStr + '仪器名：' + InstrumentStr+'。返回L0文件质量信息。';
    res.send(JSON.stringify(returnInfo));
    res.end(JSON.stringify(returnInfo));
    return;
}
exports._getDPPSL0File = getDPPSL0File;
