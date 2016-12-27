'use strict';
const fileManager_1 = require('../lib/fileManager');
const shellRunner_1 = require('../lib/shellRunner');
var config = require('config');
let fs = require('fs');
var helpers = require('../lib/helpers');
let pgConnectionString = 'postgres://****************:****************@****************.compute-1.amazonaws.com:5432/****************';
let sourceDir = '.';
let sourceFileName = `rmresult`;
let sourceFileNameCSV = `${sourceFileName}.csv`;
let sourceFileNameZip = `${sourceFileName}.zip`;
let sourceFileCSVPath = `${sourceDir}/${sourceFileNameCSV}`;
let sourceFileZipPath = `${sourceDir}/${sourceFileNameZip}`;
let destinationFileZipPath = `/Import/${sourceFileNameZip}`;
let localBashFile = 'export_data.sh';
let localScriptCmd = `/build/script/${localBashFile} "${sourceFileNameCSV}" "${pgConnectionString}"`;
helpers.logInfo('--- STARTED \'export_qualified\' JOB ---');
shellRunner_1.default.runScript(localScriptCmd)
    .then(() => {
    helpers.logInfo(`--- Creating zip file at '${sourceFileZipPath}' ---`);
    fileManager_1.default.createZip(sourceFileCSVPath, sourceFileZipPath);
    if (!fs.statSync(sourceFileZipPath)) {
        process.exit();
    }
    return fileManager_1.default.upload(sourceFileZipPath, destinationFileZipPath);
})
    .then(() => {
    helpers.logInfo(`--- Finished uploading '${sourceFileNameZip}' ---`);
    helpers.logInfo('--- Finished \'export_qualifed\' JOB ---');
})
    .fail(err => {
    helpers.logError(err);
    process.exit();
});
//# sourceMappingURL=export_data.js.map