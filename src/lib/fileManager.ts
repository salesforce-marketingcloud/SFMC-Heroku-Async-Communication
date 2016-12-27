/*
 * @module script/lib/shellRunner
 *
 * @description
 * Wrapper for file manipulation functions
 */

var Q = require('q');
var config = require('config');
var client = require('scp2');
var AdmZip = require('adm-zip');

var req: {
	host: 'ftp.s4.exacttarget.com', // sftp host
	username: '****************', // username (MID)
	password: '****************' // password
};


var constructor = {
	download: function (fileFrom: string, fileTo: string) {

		var deferred = Q.defer();

		var request: any = req;
		request.path = fileFrom;

		client.scp(request, fileTo, function (err: any) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	},

	upload: function (fileFrom: string, fileTo: string) {


		var deferred = Q.defer();

		var request: any = req;
		request.path = fileTo;

		client.scp(fileFrom, request, function (err: any) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	},

	createZip: function (fileName: string, fileTo: string) {

		let zip = new AdmZip();

		zip.addLocalFile(fileName);

		zip.writeZip(fileTo);
	}

};

export default constructor;
