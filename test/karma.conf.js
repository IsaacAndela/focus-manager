// Karma configuration
// Generated on Fri Feb 06 2015 00:22:22 GMT+0100 (CET)

module.exports = function(config) {
	"use strict";

	var packageJson = require("../package.json");

	var sourceFile = [
		packageJson.directories.source,
		packageJson.main
	].join("/");

	config.set({

	// base path that will be used to resolve all patterns (eg. files, exclude)
	basePath: __dirname + '/../',


	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ['jasmine'],


	// list of files / patterns to load in the browser
	files: [
		sourceFile,
		'test/**/*Spec.js'
	],


	// test results reporter to use
	// possible values: 'dots', 'progress'
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	reporters: ['dots'],

	// web server port
	port: 9876,

	// level of logging
	// possible values: config.LOG_DISABLE || config.LOG_ERROR ||
	//                  config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	logLevel: config.LOG_INFO,
	// singleRun: true,
	browsers: ["PhantomJS"],
});
};
