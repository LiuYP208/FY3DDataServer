/**
 * Created by 范霖 on 2015/11/07
 * 基础数据获取
 */

(function () {
	var Timer = require('./lib/commonFunc.js').timer;
	var myTimer = new Timer();
	myTimer.interval = 5000;
	myTimer.start();
	var i = 0
	myTimer.on('tick', function () {
		i++;
		console.log(i);
		if (i > 10) {
			myTimer.stop();
		}
	})
})();