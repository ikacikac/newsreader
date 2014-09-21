/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Ilija Lazarevic
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = function(grunt) {

	// load needed modules
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-wrap');
//	grunt.loadNpmTasks('gruntacular');
//
//    grunt.loadNpmTasks('grunt-contrib-clean');
//    grunt.loadNpmTasks('grunt-contrib-compress');
//    grunt.loadNpmTasks('grunt-contrib-copy');


	grunt.initConfig({
		meta: {
			pkg: grunt.file.readJSON('package.json'),
			version: '<%= meta.pkg.version %>',
            name: '<%= meta.pkg.name %>',
			production: 'build/'
		},

/*
    Commented out because it is going to be used when building
    FirefoxOS application
         */
//        copy: {
//            assets: {
//                files: [
//                    {
//                        expand: true,
//                        cwd: 'www/',
//                        src: [
//                            'css/**',
//                            'images/**',
//                            'img/**',
//                            'languages/**',
//                            'public/**',
//                            'templates/**',
//                            'vendor/**',
//                            'index_ffos.html'
//                        ],
//                        dest: 'platforms/firefoxos/assets/'
//                    },
//                    {
//                        expand: true,
//                        cwd: 'platforms/firefoxos/templates/',
//                        src: 'manifest.webapp',
//                        dest: 'platforms/firefoxos/assets/'
//                    },
//                    {
//                        expand: true,
//                        cwd: 'platforms/firefoxos/templates/',
//                        src: ['package.manifest','index.html'],
//                        dest: 'platforms/firefoxos/bin/'
//                    }
//                ]
//            },
//            archive: {
//                files: [
//                    {
//                        src: '<%= meta.name %>.<%= meta.version %>.zip',
//                        dest: 'platforms/firefoxos/bin/'
//                    }
//                ]
//            }
//        },
//
//        compress: {
//            main: {
//                options: {
//                    mode: 'zip',
//                    archive: '<%= meta.name %>.<%= meta.version %>.zip'
//                },
//                expand: true,
//                cwd: 'platforms/firefoxos/assets/',
//                src: '**',
//                dest: '/'
//            }
//        },
//
//        clean: {
//            firefoxos_assets: ['platforms/firefoxos/assets/','platforms/firefoxos/bin/'],
//            firefoxos_archive: ['<%= meta.name %>.<%= meta.version %>.zip']
//        },

		concat: {
			options: {
				// remove license headers
				stripBanners: true,
				banner: '/**\n' +
				' * Copyright (c) 2014, Ilija Lazarevic ' +
				'<ikac.ikax@gmail.com> \n' +
				' * This file is licensed under the MIT Licence\n' +
				' * See the LICENCE file.\n */\n\n'
			},
			dist: {
				src: [
                    'app/app.js',
                    'app/articles/ArticlesController.js',
                    'app/feeds/FeedsController.js',
                    'app/folders/FoldersController.js',
                    'app/login/LoginController.js',
                    'app/menu/MenuController.js',
                    'app/modules/*.js',
                    'app/directives/**/*.js',
                    '!app/**/*Spec.js'
				],
				dest: '<%= meta.production %>app.js'
			}
		},

		wrap: {
			app: {
				src: ['<%= meta.production %>app.js'],
				dest: '',
				wrapper: [
					'(function(angular, $, undefined){\n\n\'use strict;\'\n',
					'\n})(window.angular, jQuery);'
				]
			}
		},

		jshint: {
			files: [
				'Gruntfile.js',
				'app/**/*.js',
				'tests/**/*.js'
            ],
			options: {
				// options here to override JSHint defaults
				globals: {
					console: true
				}
			}
		},

		watch: {
			// this watches for changes in the app directory and runs the concat
			// and wrap tasks if something changed
			concat: {
				files: [
                    'app/**/*.js',
                    'app/**/*.html',
                    'css/*.css',
                    'Gruntfile.js'
				],
				tasks: ['build']
			}
		},

		testacular: {
			unit: {
				configFile: 'tests/config/testacular.js'
			},
			continuous: {
				configFile: 'tests/config/testacular.js',
				singleRun: true,
				browsers: ['PhantomJS'],
				reporters: ['progress', 'junit'],
				junitReporter: {
					outputFile: 'test-results.xml'
				}
			}
		}

	});

	// make tasks available under simpler commands
	grunt.registerTask('build', ['jshint', 'concat', 'wrap']);
	grunt.registerTask('watchjs', ['watch:concat']);
	grunt.registerTask('ci', ['testacular:continuous']);
	grunt.registerTask('testjs', ['testacular:unit']);
//    grunt.registerTask('firefoxos', ['clean:firefoxos_assets','clean:firefoxos_archive','copy:assets','compress','copy:archive','clean:firefoxos_archive']);

};
