# vinyl-fs-fake [![Build Status](https://travis-ci.org/callumacrae/vinyl-fs-fake.svg)](https://travis-ci.org/callumacrae/vinyl-fs-fake)

A [vinyl] adapter that extends [vinyl-fs] to allow for easy debugging by
passing in virtual files instead of globs, and calling a function instead of
writing to file.


## Install

```
$ npm install vinyl-fs-fake
```


## Usage

Say you have the following gulpfile:

```js
var gulp = require('gulp');
var plugins = require('gulp-require-plugins')();

var options = {
	JS_SRC: 'assets/js/*.js',
	JS_DEST: 'dest'
};

gulp.task('default', function () {
	gulp.src(options.JS_SRC)
		.pipe(plugins.minify())
		.pipe(plugins.concat('app.js'))
		.pipe(gulp.dest(options.JS_DEST));
});
```

If you were using vinyl-fs-fake instead of vinyl-fs, you could test your task
simply by changing the value of the `options` object:

```js
var gulp = require('gulp');
var vfsFake = require('vinyl-fs-fake');
var plugins = require('gulp-require-plugins')();

var options = {
	JS_SRC: 'assets/js/*.js',
	JS_DEST: 'dest'
};

gulp.task('default', function () {
	vfsFake.src(options.JS_SRC)
		.pipe(plugins.minify())
		.pipe(plugins.concat('app.js'))
		.pipe(vfsFake.dest(options.JS_DEST));
});
```

Then, you can replace the options object:

```js
var options = {
	JS_SRC: [
		{ path: 'test.js', contents: new Buffer('...') },
		{ path: 'test2.js', contents: new Buffer('...') }
	],
	JS_DEST: function (files) {
		assert.equals(files.length, 1);
		assert.equals(files[0].path, 'app.js');
	}
};
```

As it's just a wrapper around vinyl-fs, you can pretty much drop it straight
into your code and it will work without needing any actual thinking. Then, when
you're ready, you can write tests for your gulp tasks.

This is pretty much only useful if you
[split your gulpfile into multiple files].


### vfsFake.src

If you pass in a glob or an array of globs, it will be given to the src method
of vinyl-fs and returned. Basically, it doesn't change that behaviour.

If you pass in an object representing a file, it'll be turned into a vinyl
object and piped down the stream. You can also give it a vinyl object directly,
or an array of objects or vinyl objects.

In addition to the options accepted by the Vinyl file constructor, you can pass
the file content as a string, in which case it will be bufferized for you.

### vfsFake.dest

If you pass in a path, it will be given to the dest method of vinyl-fs and
returned; again, it doesn't change that behaviour.

However, you can now pass in a function which will be given a `files` array,
containing all the files piped through:

```js
	...
	.pipe(vfsFake.dest(function (files) {
		console.log(files[2].contents.toString('utf8'));
	});
```

It won't touch the files, so you can carry on piping that to other stuff.

You can also give it a stream, if you really want. It'll act like
`vfsFake.dest` just wasn't called at all, and the stream was just given to
`.pipe()` directly.


## License

Released under the MIT license.



[vinyl]: https://github.com/wearefractal/vinyl
[vinyl-fs]: https://github.com/wearefractal/vinyl-fs
[split your gulpfile into multiple files]: http://macr.ae/article/splitting-gulpfile-multiple-files.html