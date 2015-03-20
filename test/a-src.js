'use strict';

var vfsFake = require('../');

var path = require('path');
var File = require('vinyl');
var should = require('should');
var through = require('through2');

var fakeFiles = [
	{ path: 'fake.txt', contents: new Buffer('hello world') },
	{ path: 'fake.txt', contents: 'hello world' }
];

describe('src', function () {
	it('should explode on invalid glob (empty)', function () {
		should.throws(function () {
			vfsFake.src();
		}, /Invalid glob argument/);
	});

	it('should accept arrays of globs', function (done) {
		vfsFake.src([path.join(__dirname, 'fixtures/test.txt')])
			.pipe(through.obj(function (file, enc) {
				file.contents.toString(enc).should.containEql('hello world');

				done();
			}));
	});

	it('should accept single globs', function (done) {
		vfsFake.src(path.join(__dirname, 'fixtures/test.txt'))
			.pipe(through.obj(function (file, enc) {
				file.contents.toString(enc).should.containEql('hello world');

				done();
			}));
	});

	it('should accept options', function (done) {
		vfsFake.src(path.join(__dirname, 'fixtures/test.txt'), { read: false })
			.pipe(through.obj(function (file) {
				should.not.exist(file.contents);
				file.path.should.containEql('test');

				done();
			}));
	});

	it('should accept arrays of file objects', function (done) {
		vfsFake.src(fakeFiles)
			.pipe(through.obj(function (file) {
				file.path.should.equal(fakeFiles[0].path);
				file.contents.toString().should.equal(fakeFiles[0].contents.toString());
				file.base.should.equal(process.cwd());
				done();
			}));
	});

	it('should accept file objects', function (done) {
		vfsFake.src(fakeFiles[0])
			.pipe(through.obj(function (file) {
				file.path.should.equal(fakeFiles[0].path);
				file.contents.toString().should.equal(fakeFiles[0].contents.toString());
				file.base.should.equal(process.cwd());
				done();
			}));
	});

	it('should accept vinyl objects', function (done) {
		vfsFake.src(new File(fakeFiles[0]))
			.pipe(through.obj(function (file) {
				file.path.should.equal(fakeFiles[0].path);
				file.contents.should.equal(fakeFiles[0].contents);
				file.base.should.equal(process.cwd());
				done();
			}));
	});
});