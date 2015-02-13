'use strict';

var stream = require('stream');
var vinylFs = require('vinyl-fs');
var through = require('through2');

function dest(path, options) {
	if (path instanceof stream.Readable || (path.readable && path.writable)) {
		return path;
	}

	if (typeof path !== 'function') {
		return vinylFs.dest(path, options);
	}

	var files = [];

	return through.obj(function (file, enc, cb) {
		files.push(file);
		cb(null, file);
	}, function () {
		path(files);
	});
}

module.exports = dest;
