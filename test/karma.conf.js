// Karma configuration
// Generated on Tue Sep 16 2014 13:34:55 GMT+0200 (CEST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath:'..',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks:['jasmine'],


        // list of files / patterns to load in the browser
        files:[
//            'node_modules/karma-jasmine/lib/adapter.js',
//            'node_modules/karma-jasmine/lib/jasmine.js',
            'lib/angular/angular.js',
            'lib/angular-route/angular-route.js',
            'lib/angular-mocks/angular-mocks.js',
            'lib/angular-bindonce/bindonce.js',
            'lib/angular-sanitize/angular-sanitize.js',
            'lib/angular-local-storage/angular-local-storage.js',
            'app/app.js',
            'app/**/*.js'
        ],


        // list of files to exclude
        exclude:[
            'app/modules/owncloud/run-chrome.js'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors:{
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters:['progress'],


        // web server port
        port:9876,


        // enable / disable colors in the output (reporters and logs)
        colors:true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel:config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch:true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers:['Firefox'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun:false
    });
};
