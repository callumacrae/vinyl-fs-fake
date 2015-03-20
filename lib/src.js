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
			var contents;
			if (file instanceof File) {
				this.push(file);
			} else if (typeof file === 'object') {
				contents = file.contents;
				contents = (typeof contents === 'string') ? new Buffer(contents) : contents;

				this.push(new File({
					contents: contents,
					cwd:      file.cwd,
					base:     file.base,
					path:     file.path
				}));
			}

		}, this);

		this.push(null);
	};

	return srcStream;
}

module.exports = src;
