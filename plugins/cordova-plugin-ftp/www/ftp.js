/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var exec = require('cordova/exec');

/**
 * Ftp class
 * @constructor
 */
function Ftp() {
}

/**
 * Connect to one ftp server.
 *
 * Just need to init the connection once. If success, you can do any ftp actions later.
 *
 * @param {string} hostname The ftp server url. Like ip without protocol prefix, e.g. "192.168.1.1".
 * @param {string} username The ftp login username. If it and `password` are all blank/undefined, the default username "anonymous" is used.
 * @param {string} password The ftp login password. If it and `username` are all blank/undefined, the default password "anonymous@" is used.
 * @param {function} successCallback The success callback.
 *                                   Notice: For iOS, if triggered, means `init` success, but NOT means the later action, e.g. `ls`... `download` will success!
 * @param {function} errorCallback The error callback. If triggered, means init fail.
 */
Ftp.prototype.connect = function(hostname, username, password, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "connect",
         [hostname, username, password]);
};

/**
 * List files (with info of `name`, `type`, `link`, `size`, `modifiedDate`) under one directory on the ftp server.
 *
 * You can get one file's name using `fileList[x].name` (`x` is the location in array).
 *
 * Explain key:
 * - name: file name (utf-8).
 * - type: file type. number `0` means regular file, `1` means directory, `2` means symbolic link, `-1` means unknown type (maybe block dev, char dev...).
 * - link: if the file is a symbolic link, then this field store symbolic link information (utf-8), else it's a blank string.
 * - size: file size in bytes.
 * - modifiedDate: modified date of this file. date format is `yyyy-MM-dd HH:mm:ss zzz`, e.g "2015-12-01 20:45:00 GMT+8".
 *
 * @param {string} path The path on the ftp server. e.g. "/adf/123/".
 * @param {function} successCallback The success callback, invoked with arg `{array} fileList`.
 * @param {function} errorCallback The error callback. If triggered, means fail.
 */
Ftp.prototype.ls = function(path, successCallback, errorCallback) {
    exec(function(fileList) {
            if (fileList instanceof Array) {
                successCallback(fileList);
            }
         },
         errorCallback,
         "Ftp",
         "list",
         [path]);
};

/**
 * Create one directory on the ftp server.
 *
 * @param {string} path The directory you want to create. e.g. "/adf/123/newDir/".
 * @param {function} successCallback The success callback. If triggered, means success.
 * @param {function} errorCallback The error callback. If triggered, means fail.
 */
Ftp.prototype.mkdir = function(path, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "createDirectory",
         [path]);
};

/**
 * Delete one directory on the ftp server.
 *
 * Tip: As many ftp server could not rm dir when it's not empty, so rm all files under the dir at first is recommended.
 *
 * @param {string} path The directory you want to delete. e.g. "/adf/123/newDir/".
 * @param {function} successCallback The success callback. If triggered, means success.
 * @param {function} errorCallback The error callback. If triggered, means fail.
 */
Ftp.prototype.rmdir = function(path, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "deleteDirectory",
         [path]);
};

/**
 * Delete one file on the ftp server.
 *
 * @param {string} file The file (with full path) you want to delete. e.g. "/adf/123/newDir/myFile".
 * @param {function} successCallback The success callback. If triggered, means success.
 * @param {function} errorCallback The error callback. If triggered, means fail.
 */
Ftp.prototype.rm = function(file, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "deleteFile",
         [file]);
};

/**
 * Upload one local file to the ftp server.
 *
 * @param {string} localFile The file (with full path) you want to upload. e.g. "/local/path/to/localFile".
 * @param {string} remoteFile The file (with full path) you want to located on the ftp server. e.g. "/adf/123/newDir/remoteFile".
 *                            You can see, "localFile" is also renamed to "remoteFile".
 * @param {function} successCallback The success callback. It will be triggered many times according the file's size.
 *                                   The arg `0`, `0.1xx`, `0.2xx` ... `1` means the upload percent. When it reach `1`, means success.
 * @param {function} errorCallback The error callback. If triggered, means fail.
 */
Ftp.prototype.upload = function(localFile, remoteFile, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "uploadFile",
         [localFile, remoteFile]);
};

/**
 * Download one remote file on the ftp server to local path.
 *
 * @param {string} localFile The file (with full path) you want to located on the local device. e.g. "/local/path/to/localFile".
 * @param {string} remoteFile The file (with full path) you want to download on the ftp server. e.g. "/adf/123/newDir/remoteFile".
 *                            You can see, "remoteFile" is also renamed to "localFile".
 * @param {function} successCallback The success callback. It will be triggered many times according the file's size.
 *                                   The arg `0`, `0.1xx`, `0.2xx` ... `1` means the download percent. When it reach `1`, means success.
 * @param {function} errorCallback The error callback. If triggered, means fail.
 */
Ftp.prototype.download = function(localFile, remoteFile, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "downloadFile",
         [localFile, remoteFile]);
};

/**
 * Cancel all requests. Always success.
 *
 * @param {function} successCallback The success callback. If triggered, means `cancel` success.
 * @param {function} errorCallback The error callback. If triggered, means cancel fail.
 */
Ftp.prototype.cancel = function(successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "cancelAllRequests",
         []);
};

/**
 * Disconnect from ftp server.
 *
 * @param {function} successCallback The success callback. If triggered, means `disconnect` success.
 * @param {function} errorCallback The error callback. If triggered, means disconnect fail.
 */
Ftp.prototype.disconnect = function(successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "disconnect",
         []);
};

module.exports = new Ftp();
