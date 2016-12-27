'use strict';
var childProcess = require('child_process');
var helpers = require('../lib/helpers');
var q = require('q');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    runScript: function (filePath) {
        helpers.logDebug('Running script: ' + process.cwd() + filePath);
        var deferred = q.defer();
        var cp = childProcess.exec('sh ' + process.cwd() + filePath, (error, stdout, stderr) => {
            if (error) {
                helpers.logError(`exec error: ${error}`);
                deferred.reject(error);
                return;
            }
            helpers.logInfo(`stdout: ${stdout}`);
            helpers.logInfo(`stderr: ${stderr}`);
        });
        cp.on('close', (code, signal) => {
            helpers.logInfo(`child process terminated due to receipt of code - ${code} and signal - ${signal}`);
            deferred.resolve();
        });
        return deferred.promise;
    }
};
//# sourceMappingURL=shellRunner.js.map