'use strict';

var vinylFs = require('vinyl-fs');

module.exports = {
	src: require('./lib/src'),
	dest: require('./lib/dest'),
	symlink: vinylFs.symlink,
	watch: vinylFs.watch
};