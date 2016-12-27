/*
 * @module script/lib/shellRunner
 *
 * @description
 * Responsible for executing the bash scripts
 */

'use strict';

var childProcess = require('child_process');
var helpers = require('../lib/helpers');
var q = require('q');

export default {
	runScript: function (filePath: string) {
		helpers.logDebug('Running script: ' + process.cwd() + filePath);

		var deferred = q.defer();

		var cp = childProcess.exec('sh ' + process.cwd() + filePath, (error: string, stdout: string, stderr: string) => {
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

