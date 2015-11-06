/**
 * Created by 范霖 on 2015/11/02.
 */

/**
 * 获取客户端IP
 */
exports.getClientIP = function (req) {
	return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
};

/**
 * 获取本机IP
 */
exports.getLoacalIP = function () {
	var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
		var iface = interfaces[devName];
		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
				return alias.address;
			}
		}
    }
};