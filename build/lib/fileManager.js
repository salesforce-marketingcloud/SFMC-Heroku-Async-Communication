"use strict";
var Q = require('q');
var config = require('config');
var client = require('scp2');
var AdmZip = require('adm-zip');
var req;
var constructor = {
    download: function (fileFrom, fileTo) {
        var deferred = Q.defer();
        var request = req;
        request.path = fileFrom;
        client.scp(request, fileTo, function (err) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    },
    upload: function (fileFrom, fileTo) {
        var deferred = Q.defer();
        var request = req;
        request.path = fileTo;
        client.scp(fileFrom, request, function (err) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    },
    createZip: function (fileName, fileTo) {
        let zip = new AdmZip();
        zip.addLocalFile(fileName);
        zip.writeZip(fileTo);
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = constructor;
//# sourceMappingURL=fileManager.js.map