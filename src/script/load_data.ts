/*
 * @module script/load_data
 *
 * @description
 * Responsible for downloading load_data.zip file from SFMC, unzipping
 * the downloaded file, and executing the load_data bash script.
 */

'use strict';

// IMPORTS
import fileManager from '../lib/fileManager';
import shellRunner from '../lib/shellRunner';

// REQUIRES
let config = require('config');
let helpers = require('../lib/helpers');

// LOCAL VARIABLES
let pgConnectionString = 'postgres://****************:****************@****************.compute-1.amazonaws.com:5432/****************';

let sourceFileName = 'test.zip';
let sourceFilePath = `/Export/${sourceFileName}`;

let destinationDir = '.';
let destinationFilePath = `${destinationDir}/${sourceFileName}`;

let localBashFile = 'load_data.sh';
let localScriptCmd = `/build/script/${localBashFile} "${destinationDir}" "${sourceFileName}" "${pgConnectionString}"`;

// EXECUTION
helpers.logInfo('--- STARTED \'load_targets\' JOB ---');


fileManager.download(sourceFilePath, destinationFilePath)
	.then(() => {
		helpers.logInfo(`--- Finished downloading '${sourceFilePath}' ---`);
		return shellRunner.runScript(localScriptCmd);
	})
	.then(() => {
		helpers.logInfo(`--- Finished executing '${localBashFile}' ---`);
		helpers.logInfo('--- FINISHED \'load_targets\' JOB ---');
	})
	.fail(err => {
		helpers.logError(err);
		process.exit();
	});
