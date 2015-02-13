'use strict';

var File = require('vinyl');
var stream = require('stream');
var vinylFs = require('vinyl-fs');

function src(files, options) {
	if (!Array.isArray(files)) {
		return src([files], options);
	}

	// If invalid input, let vinyl handle the error
	if (!files[0] || typeof files[0] === 'string') {
		return vinylFs.src(files, options);
	}

	var srcStream = new stream.Readable({ objectMode: true });

	srcStream._read = function () {
		files.forEach(function (file) {
			this.push(file instanceof File ? file : new File(file));
		}, this);

		this.push(null);
	};

	return srcStream;
}

module.exports = src;
