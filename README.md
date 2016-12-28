# Asynchronous communication technique for Heroku and Marketing Cloud


## Table of Contents

* [Getting Started](Ggetting-started)
* [Marketing Cloud to Heroku](#marketing-cloud-to-heroku)
  * [Marketing Cloud setup](#marketing-cloud-setup)
  * [Heroku App setup](#heroku-app-setup)
  * [Running Job](#running-job)
* [Heroku to Marketing Cloud](#heroku-to-marketing-cloud)
  * [Heroku App setup](#heroku-app-setup-1)
  * [Marketing Cloud setup](#marketing-cloud-setup-1)
  * [Running Job](#running-job-1)
* [Troubleshooting](#troubleshooting)
  * [Typescript error 1](#typescript-error-1)
  * [Cannot read property 'setUp' of null](#cannot-read-property-setup-of-null)


## Getting Started
Install packages
  - `npm install`
  - `npm install -g typescript@2.0.3`
  - `npm install -g typings`
  - `typings install`


Once Typescript is working correctly through `typings install`
you can then run it for the entire project through the following command
at the base folder.

> grunt default-watch


** This will monitor local files in the `src` folder and generate them to the `build` directory **

## Marketing Cloud to Heroku

Marketing Cloud to Heroku push is done in two steps:
 * exporting DataExtention to zip file
 * load this file to Heroku and upload it to db.

### Marketing Cloud setup
Make sure your Marketing Cloud account is provisioned with Mail, Automation Studio and Enhanced FTP.

Navigate to Email app and then in top menu pick Interactions -> Data Extract.

![screenshot](docs/mcImgs/email.png)

We will need to create three Data Exports.  In newly loaded page click Create.

![screenshot](docs/mcImgs/mc_DataExtract.png)

Fill the form and click Save.  Repeat two more times.

![screenshot](docs/mcImgs/de_export.png)

![screenshot](docs/mcImgs/de_convert.png)

![screenshot](docs/mcImgs/de_zip.png)

You should have three data exports: `Demo_Customers_Convert`, `Demo_Customers_Export`, `Demo_Customers_Zip`.

Navigate to File Transfers and click on Create

![screenshot](docs/mcImgs/fileTransfer.png)

Fill the form and click save.

![screenshot](docs/mcImgs/fileTransfer_new.png)

Navigate to Automation Studio

![screenshot](docs/mcImgs/automationStudio.png)

Create a new Scheduled Automation

![screenshot](docs/mcImgs/automationStudio_new.png)

In the newly loaded window switch to Workflow tab and select Activities from the toolbox on the right and drop them into the working area.

![screenshot](docs/mcImgs/automationStudio_workflow.png)

For each step slick in Choose and pick activity created earlier.
* Step1 - `Demo_Customers_Convert`,
* Step2 - `Demo_Customers_Export`,
* Step3 - `Demo_Customers_FileTransfer`,
* Step4 - `Demo_Customers_Zip`.

Save it and click Run Once to verify Automation is working and file fil be moved to ftp location.

### Heroku App setup

Once file is posted to FTP we can load it and then copy it to PG db.  Heroku app that is build for this was written on TypeScript which then compiled to node.js.  It is a good practice to write projects in TypeScript,  small slowness in the beginning in development will pay you off when your project will start growing.

Usually you will run Export/Import as [one off dynos](https://devcenter.heroku.com/articles/one-off-dynos) via [scheduled jobs](https://devcenter.heroku.com/articles/scheduler).

* Ensure pg connection string is set in `/src/script/load_data.ts`
* Ensure sftp credentials are set in /src/lib/fileManager.ts
* variables in `src/script/load_data.ts`
  * `pgConnectionString` is variable to store PG connection string
  * `sourceFileName` is variable to store file name in ftp folder
  * `sourceFilePath` is variable to store file path on ftp

* changes to `src/script/load_data.sh`
  * `_TableName` - schema.table_name value where to load data
  * `_TableFields` - comma separated list of fields which also should match columns in csv file.

* run `grunt default-watch` to compile TypeScript

### Running Job

* now your app is complied, execute `node /build/script/load_data.js` to run it


## Heroku to Marketing Cloud

Heroku to Marketing Cloud push is done in two steps:
 * exporting PG table to zip file and uploading it to Marketing Cloud
 * starting Automation Studio trigger and loading data to DataExtention

### Heroku App setup

* Ensure pg connection string is set in `/src/script/export_data.ts`
* Ensure sftp credentials are set in /src/lib/fileManager.ts
* variables in `src/script/export_data.ts`
  * `pgConnectionString` is variable to store PG connection string
  * `sourceFileName` is variable to store file name that will be uploaded to ftp folder
  * `destinationFileZipPath` is variable to store file path on ftp

* changes to `src/script/export_data.sh`
  * `_SQL` - sql query that generates data to export

* run `grunt default-watch` to compile TypeScript


### Marketing Cloud setup

Make sure your Marketing Cloud account is provisioned with Mail, Automation Studio and Enhanced FTP.

Navigate to Email app.

![screenshot](docs/mcImgs/email.png)

Navigate to Admin and then on the right side click on Data Management -> File Locations.  We will create/find location from where Marketing Cloud will load exported from Heroku file.

![screenshot](docs/mcImgs/admin.png)

Find/Create location where `Location Type` is Enhanced FTP Site Import Directory

![screenshot](docs/mcImgs/Enhanced_FTP_Site_Import_Directory.png)

In top menu pick Interactions -> File Transfer and then click on Create

![screenshot](docs/mcImgs/fileTransfer.png)

Fill the form.

![screenshot](docs/mcImgs/Demo_Download_export_data.png)

Navigate to Interactions->Import and then click Create

![screenshot](docs/mcImgs/Interactions_Import.png)

Fill the form

![screenshot](docs/mcImgs/Demo_export_data_import.png)

Navigate to Automation Studio

![screenshot](docs/mcImgs/automationStudio.png)

Create a new Triggered Automation

![screenshot](docs/mcImgs/automationStudio_new.png)

In the newly loaded window switch to Workflow tab and click on `Trigger Setup`

![screenshot](docs/mcImgs/trigger_setup.png)



select Activities from the toolbox on the right and drop them into the working area.



## Troubleshooting

#### Typescript error 1

If you run into the following error:

```
	typings/globals/require/index.d.ts(367,13): error TS2403: Subsequent variable declarations must have the same type.  Variable 'require' must be of type 'NodeRequire', but here has type 'Require'.

	>> 1 non-emit-preventing type warning
	>> Error: tsc return code: 2
	Warning: Task "ts:app" failed. Use --force to continue.

	Aborted due to warnings.
```

screenshot:
![screenshot](docs/images/TypeScriptError1.jpg)

###### Resolution

The issue is due to the module at "globals/require/index.d.ts"
It appears that it is using Require instead of 'require'.

To fix this, remove the following line, from `typings/index.d.s`

	/// <reference path="globals/require/index.d.ts" />

#### Cannot read property 'setUp' of null

If you run into the following error:

```
	not ok 1 - TypeError: Cannot read property 'setUp' of null
	  ---
	  at:
	    line: 285
	    column: 14
	    file: node_modules/nodeunit/lib/core.js
	    function: wrapGroup
	  stack: |
	    wrapGroup (node_modules/nodeunit/lib/core.js:285:14)
	    wrapGroup (node_modules/nodeunit/lib/core.js:306:24)
	    Object.exports.runModule (node_modules/nodeunit/lib/core.js:146:11)
	    node_modules/nodeunit/lib/nodeunit.js:75:21
	    node_modules/nodeunit/deps/async.js:513:13
	    iterate (node_modules/nodeunit/deps/async.js:123:13)
	    node_modules/nodeunit/deps/async.js:134:25
	    node_modules/nodeunit/deps/async.js:515:17
	    node_modules/nodeunit/lib/core.js:165:9
	    node_modules/nodeunit/deps/async.js:518:13
	    async.forEachSeries (node_modules/nodeunit/deps/async.js:119:20)
	    _concat (node_modules/nodeunit/deps/async.js:512:9)
	    Object.concatSeries (node_modules/nodeunit/deps/async.js:152:23)
	    Object.exports.runSuite (node_modules/nodeunit/lib/core.js:96:11)
	    Object.exports.runModule (node_modules/nodeunit/lib/core.js:158:13)
	    node_modules/nodeunit/lib/nodeunit.js:75:21
	  test: TAP
	  message: 'TypeError: Cannot read property ''setUp'' of null'
	  source: |
	    if (group.setUp) {
```
###### Resolution

The issue is due to a missing null check in the nodeunit core.js file.

The issue is likely because a property was assigned null on the exports of the unit test somehow.

You can likely only find out which one it is by adding the following line at:
/usr/local/lib/node_modules/nodeunit/lib/core.js before of the line 285

	//Added line
	if(!group) return;

See here for more information:
[https://github.com/caolan/nodeunit/issues/198](https://github.com/caolan/nodeunit/issues/198)

