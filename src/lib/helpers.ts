'use strict';

var logger = require('logfmt');
var extend = require('extend');
var config = require('config');

declare global {
    interface Date {
        toDB(): string;
    }
}



var helpers = {

    isUndOrNull: function(obj: any) {
        return obj === undefined || obj === null;
    },


    isArray: function(v: any) {
        return Object.prototype.toString.call(v) === '[object Array]';
    },


    isString: function(v: any) {
        return typeof v === "string";
    },


    log: function(type: string, msg: any, level: number) {
        //Only log messages of the given level
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

    logDebug: function(msg: any) {
        helpers.log('DEBUG: ', msg, this.logLevels.DEBUG);
    },

    logInfo: function(msg: any) {
        helpers.log('INFO: ', msg, this.logLevels.INFO);
    },

    logError: function(msg: any) {
        helpers.log('~~~~ E R R O R ~~~~', msg, this.logLevels.ERROR);
    },

    logLevels: {
        DEBUG: 2,
        INFO: 1,
        ERROR: 0
    }


};

export default helpers;

module.exports = helpers;
