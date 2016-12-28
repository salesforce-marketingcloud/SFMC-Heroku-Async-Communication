/*
 * @module script/export_data
 *
 * @description
 * Responsible for executing the export_data bash script, zipping the
 * resulting csv file, and uploading the zipped file to SFMC.
 */

'use strict';

// IMPORTS
import fileManager from '../lib/fileManager';
import shellRunner from '../lib/shellRunner';

// REQUIRES
var config = require('config');
let fs = require('fs');
var helpers = require('../lib/helpers');

// LOCAL VARIABLES
let pgConnectionString = 'postgres://****************:****************@****************.compute-1.amazonaws.com:5432/****************';

let sourceDir = '.';
let sourceFileName = `export_data`;
let sourceFileNameCSV = `${sourceFileName}.csv`;
let sourceFileNameZip = `${sourceFileName}.zip`;
let sourceFileCSVPath = `${sourceDir}/${sourceFileNameCSV}`;
let sourceFileZipPath = `${sourceDir}/${sourceFileNameZip}`;

//destination folder
let destinationFileZipPath = `/Import/${sourceFileNameZip}`;

let localBashFile = 'export_data.sh';
let localScriptCmd = `/build/script/${localBashFile} "${sourceFileNameCSV}" "${pgConnectionString}"`;

// EXECUTION
helpers.logInfo('--- STARTED \'export_qualified\' JOB ---');


shellRunner.runScript(localScriptCmd)
	.then(() => {
		helpers.logInfo(`--- Creating zip file at '${sourceFileZipPath}' ---`);

		fileManager.createZip(sourceFileCSVPath, sourceFileZipPath);

		if (!fs.statSync(sourceFileZipPath)) {
			process.exit();
		}

		return fileManager.upload(sourceFileZipPath, destinationFileZipPath);
	})
	.then(() => {
		helpers.logInfo(`--- Finished uploading '${sourceFileNameZip}' ---`);
		helpers.logInfo('--- Finished \'export_qualifed\' JOB ---');
	})
	.fail(err => {
		helpers.logError(err);
		process.exit();
	});
