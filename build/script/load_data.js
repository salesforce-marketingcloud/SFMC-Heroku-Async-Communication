'use strict';
const fileManager_1 = require('../lib/fileManager');
const shellRunner_1 = require('../lib/shellRunner');
let config = require('config');
let helpers = require('../lib/helpers');
let pgConnectionString = 'postgres://****************:****************@****************.compute-1.amazonaws.com:5432/****************';
let sourceFileName = 'test.zip';
let sourceFilePath = `/Export/${sourceFileName}`;
let destinationDir = '.';
let destinationFilePath = `${destinationDir}/${sourceFileName}`;
let localBashFile = 'load_data.sh';
let localScriptCmd = `/build/script/${localBashFile} "${destinationDir}" "${sourceFileName}" "${pgConnectionString}"`;
helpers.logInfo('--- STARTED \'load_targets\' JOB ---');
fileManager_1.default.download(sourceFilePath, destinationFilePath)
    .then(() => {
    helpers.logInfo(`--- Finished downloading '${sourceFilePath}' ---`);
    return shellRunner_1.default.runScript(localScriptCmd);
})
    .then(() => {
    helpers.logInfo(`--- Finished executing '${localBashFile}' ---`);
    helpers.logInfo('--- FINISHED \'load_targets\' JOB ---');
})
    .fail(err => {
    helpers.logError(err);
    process.exit();
});
//# sourceMappingURL=load_data.js.map