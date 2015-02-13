'use strict';

var vfsFake = require('../');

var del = require('del');
var fs = require('graceful-fs');
var through = require('through2');

var fakeFile = { path: 'fake.txt', contents: new Buffer('hello world') };

describe('dest', function () {
	beforeEach(del.bind(null, 'fixtures-out'));
	afterEach(del.bind(null, 'fixtures-out'));

	it('should accept path arguments', function (done) {
		vfsFake.src(fakeFile)
			.pipe(vfsFake.dest('fixtures-out'))
			.on('end', function () {
				fs.readFile('fixtures-out/fake.txt', function (err, data) {
					if (err) {
						throw err;
					}

					data.toString('utf8').should.equal('hello world');
					done();
				});
			});
	});

	it('should accept function arguments', function (done) {
		vfsFake.src(fakeFile)
			.pipe(vfsFake.dest(function (files) {
				files.length.should.equal(1);
				files[0].contents.should.equal(fakeFile.contents)
				done();
			}));
	});

	it('should accept streams', function (done) {
		vfsFake.src(fakeFile)
			.pipe(vfsFake.dest(through.obj(function (file, enc, cb) {
				file.contents.toString(enc).should.equal('hello world');

				file.contents = new Buffer('lol');

				cb(null, file);
			})))
			.pipe(vfsFake.dest(through.obj(function (file, enc) {
				file.contents.toString(enc).should.equal('lol');

				done();
			})));
	});
});