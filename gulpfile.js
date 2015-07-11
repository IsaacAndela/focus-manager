"use strict";

var config = require("./package.json");
var gulp = require("gulp");

(function () {
	var karma = require('karma').server;

	/**
	* Run test once and exit
	*/
	gulp.task('test', function () {
		return karma.start({
			configFile: __dirname + '/test/karma.conf.js',
			singleRun: true,
			autoWatch: false,

		});
	});
}());

(function () {
	var karma = require('karma').server;

	/**
	* Run test once and exit
	*/
	gulp.task('watchtest', function () {
		return karma.start({
			configFile: __dirname + '/test/karma.conf.js',
			singleRun: false,
			autoWatch: true,

		});
	});
}());

(function () {
	var umd = require("gulp-umd");

	var sourceFile = [
		config.directories.source,
		config.main
	].join("/");

	gulp.task('umd', function () {
		return gulp.src(sourceFile)
			.pipe(umd({
				exports: function () {
					return config.mainModuleName;
				},
				namespace: function () {
					return config.mainModuleName;
				}
			}))
			.pipe(gulp.dest("."));
	});
}());

(function () {
	var sourcemaps = require("gulp-sourcemaps");
	var rename = require("gulp-rename");
	var uglify = require("gulp-uglify");

	var sourceFile = config.main;

	gulp.task('dist', ['umd'], function () {
		return gulp.src(sourceFile)
			.pipe(sourcemaps.init())
			.pipe(rename(config.mainMinified))
			.pipe(uglify())
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest("."));
	});
}());

(function () {
	gulp.task('default', ['dist']);
}());