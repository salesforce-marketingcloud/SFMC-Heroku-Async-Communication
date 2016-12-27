'use strict';
var logger = require('logfmt');
var extend = require('extend');
var config = require('config');
var helpers = {
    isUndOrNull: function (obj) {
        return obj === undefined || obj === null;
    },
    isArray: function (v) {
        return Object.prototype.toString.call(v) === '[object Array]';
    },
    isString: function (v) {
        return typeof v === "string";
    },
    log: function (type, msg, level) {
        if (level && level > config.log_level) {
            return;
        }
        type = helpers.isUndOrNull(type) ? "undefined" : type;
        msg = helpers.isUndOrNull(msg) ? "undefined" : msg;
        var result = {
            type: type,
            msg: null,
            message: null
        };
        if (helpers.isString(msg) || helpers.isArray((msg))) {
            result.msg = msg;
        }
        else {
            extend(result, msg);
        }
        if (msg.message !== undefined) {
            result.message = msg.message;
        }
        logger.log(result);
    },
    logDebug: function (msg) {
        helpers.log('DEBUG: ', msg, this.logLevels.DEBUG);
    },
    logInfo: function (msg) {
        helpers.log('INFO: ', msg, this.logLevels.INFO);
    },
    logError: function (msg) {
        helpers.log('~~~~ E R R O R ~~~~', msg, this.logLevels.ERROR);
    },
    logLevels: {
        DEBUG: 2,
        INFO: 1,
        ERROR: 0
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = helpers;
module.exports = helpers;
//# sourceMappingURL=helpers.js.map