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

module.exports = function (grunt) {

    // load needed modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-cordovacli');

    grunt.initConfig({
        meta:{
            pkg:grunt.file.readJSON('package.json'),

            version:'<%= meta.pkg.version %>',
            name:'<%= meta.pkg.name %>',
            author:'<%= meta.pkg.author %>',
            description:'<%= meta.pkg.description %>',
            keyword:'<%= meta.pkg.keywords %>',

            build:'build',
            web:'build/web',
            chrome:'build/chrome',
            firefoxos:'build/firefoxos'
        },

        concat:{
            options:{
                stripBanners:true
            },
            app:{
                src:[
                    'app/app.js',
                    'app/articles/ArticlesController.js',
                    'app/feeds/FeedsController.js',
                    'app/folders/FoldersController.js',
                    'app/login/LoginController.js',
                    'app/menu/MenuController.js',
                    'app/directives/**/*.js',
                    '!app/**/*Spec.js'
                ],
                dest:'<%= meta.build %>/app.js'
            },
            modulesweb:{
                src:[
                    'app/modules/owncloud/config.js',
                    'app/modules/owncloud/run.js',
                    'app/modules/owncloud/services.js',
                    '!app/modules/*Spec.js'
                ],
                dest:'<%= meta.build %>/modules.js'
            },
            moduleschrome:{
                options:{
                    stripBanners:true
                },
                src:[
                    'app/modules/owncloud/config.js',
                    'app/modules/owncloud/run-chrome.js',
                    'app/modules/owncloud/services.js'
                ],
                dest:'<%= meta.build %>/modules.js'
            },
            partials:{
                options:{
                    stripBanners:true
                },
                src:'app/**/*.html',
                dest:'<%= meta.build %>/partials.tpl'
            }
        },

        uglify:{
            options:{
                stripBanners:true,
                banner:'/**\n' +
                    ' * Copyright (c) 2014, Ilija Lazarevic ' +
                    '<ikac.ikax@gmail.com> \n' +
                    ' * This file is licensed under the MIT Licence\n' +
                    ' * See the LICENCE file.\n */\n\n',
//                wrap: true,
                mangle:true
            },
            app:{
                files:{
                    '<%= meta.build %>/app.min.js':'<%= meta.build %>/app.js'
                }
            },
            modulesweb:{
                files:{
                    '<%= meta.build %>/modules.min.js':[
                        '<%= meta.build %>/modules.js'
                    ]
                }
            },
            moduleschrome:{
                files:{
                    '<%= meta.build %>/modules.min.js':[
                        '<%= meta.build %>/modules.js'
                    ]
                }
            }
        },

        wrap:{
            app:{
                src:['<%= meta.build %>/app.js'],
                dest:'',
                options:{
                    wrapper:[
                        '(function(angular, $, undefined){\n\'use strict;\'\n',
                        '\n})(window.angular, jQuery);'
                    ]
                }
            },
            modules:{
                src:['<%= meta.build %>/modules.js'],
                dest:'',
                options:{
                    wrapper:[
                        '(function(angular, $, undefined){\n\'use strict;\'\n',
                        '\n})(window.angular, jQuery);'
                    ]
                }
            }
        },

        clean:{
            web:[
                '<%= meta.web %>/*'
            ],
            chrome:[
                '<%= meta.chrome %>/*'
            ],
            buildfiles:[
                '<%= meta.build %>/*.js',
                '<%= meta.build %>/*.tpl'
            ],
            build:[
                '<%= meta.build %>'
            ],
            cordovawww:[
                '<%= meta.build %>/cordova/www/**/*'
            ],
            firefoxos:[
                '<%= meta.firefoxos %>'
            ]
        },

        mkdir:{
            init:{
                options:{
                    mode:0755,
                    create:[
                        '<%= meta.build %>',
                        '<%= meta.web %>',
                        '<%= meta.chrome %>'
                    ]
                }
            },

            web:{
                options:{
                    mode:0755,
                    create:[
                        '<%= meta.web %>',
                        '<%= meta.web %>/css',
                        '<%= meta.web %>/images',
                        '<%= meta.web %>/partials',
                        '<%= meta.web %>/js',
                        '<%= meta.web %>/js/lib'
                    ]
                }
            },

            chrome:{
                options:{
                    mode:0755,
                    create:[
                        '<%= meta.chrome %>',
                        '<%= meta.chrome %>/css',
                        '<%= meta.chrome %>/images',
                        '<%= meta.chrome %>/partials',
                        '<%= meta.chrome %>/js',
                        '<%= meta.chrome %>/js/lib'
                    ]
                }
            },

            firefoxos:{
                options:{
                    mode:0755,
                    create:[
                        '<%= meta.firefoxos %>',
                        '<%= meta.firefoxos %>/www'
                    ]
                }
            }
        },

        copy:{
            debug:{
                files:[
                    // COPY NOT MINIFIED JS LIBRARIES FILES
                    {
                        expand:true,
                        cwd:'lib/',
                        src:[
                            'angular/angular.js',
                            'angular-bindonce/bindonce.js',
                            'angular-sanitize/angular-sanitize.js',
                            'angular-route/angular-route.js',
                            'bootstrap/dist/js/bootstrap.js',
                            'angular-local-storage/angular-local-storage.js',
                            'jquery/dist/jquery.js'
                        ],
                        dest:'<%= meta.web %>/js/lib/'
                    },
                    // COPY APPLICATION AND MODULES JS FILES
                    {
                        expand:true,
                        cwd:'build/',
                        src:[
                            'app.js',
                            'modules.js'
                        ],
                        dest:'<%= meta.web %>/js/'
                    },
                    // COPY IMAGES FILES
                    {
                        expand:true,
                        cwd:'images',
                        src:'*',
                        dest:'<%= meta.web %>/images/'
                    },
                    // COPY TWEAK CSS FILE
                    {
                        expand:true,
                        cwd:'css/',
                        src:'tweak.css',
                        dest:'<%= meta.web %>/css/'
                    },
                    // COPY NOT MINIFIED CSS LIBRARIES FILES
                    {
                        expand:true,
                        cwd:'lib/',
                        src:[
                            'bootstrap/dist/css/bootstrap.css',
                            'bootstrap/dist/fonts/*',
                            'normalize-css/normalize.css'
                        ],
                        dest:'<%= meta.web %>/css/'
                    }
                ]
            },
            web:{
                files:[
                    {
                        expand:true,
                        cwd:'lib/',
                        src:[
                            'angular/angular.min.js',
                            'angular-bindonce/bindonce.min.js',
                            'angular-sanitize/angular-sanitize.min.js',
                            'angular-route/angular-route.min.js',
                            'bootstrap/dist/js/bootstrap.min.js',
                            'angular-local-storage/angular-local-storage.min.js',
                            'jquery/dist/jquery.min.js'
                        ],
                        dest:'<%= meta.web %>/js/lib/'
                    },
                    // COPY APPLICATION AND MODULES JS FILES
                    {
                        expand:true,
                        cwd:'build/',
                        src:[
                            'app.min.js',
                            'modules.min.js'
                        ],
                        dest:'<%= meta.web %>/js/'
                    },
                    // COPY IMAGES FILES
                    {
                        expand:true,
                        cwd:'images',
                        src:'*',
                        dest:'<%= meta.web %>/images/'
                    },
                    // COPY TWEAK CSS FILE
                    {
                        expand:true,
                        cwd:'css/',
                        src:'tweak.css',
                        dest:'<%= meta.web %>/css/'
                    },
                    // COPY NOT MINIFIED CSS LIBRARIES FILES
                    {
                        expand:true,
                        cwd:'lib/',
                        src:[
                            'bootstrap/dist/css/bootstrap.min.css',
                            'bootstrap/dist/fonts/*',
                            'normalize-css/normalize.css'
                        ],
                        dest:'<%= meta.web %>/css/'
                    },
                    // COPY PARTIALS
                    {
                        expand:true,
                        cwd:'<%= meta.build %>',
                        src:'partials.tpl',
                        dest:'<%= meta.web %>/partials/'
                    }
                ]
            },
            chrome:{
                files:[
                    {
                        expand:true,
                        cwd:'lib/',
                        src:[
                            'angular/angular.min.js',
                            'angular-bindonce/bindonce.min.js',
                            'angular-sanitize/angular-sanitize.min.js',
                            'angular-route/angular-route.min.js',
                            'bootstrap/dist/js/bootstrap.min.js',
                            'angular-local-storage/angular-local-storage.min.js',
                            'jquery/dist/jquery.min.js'
                        ],
                        dest:'<%= meta.chrome %>/js/lib/'
                    },
                    // COPY APPLICATION AND MODULES JS FILES
                    {
                        expand:true,
                        cwd:'build/',
                        src:[
                            'app.min.js',
                            'modules.min.js'
                        ],
                        dest:'<%= meta.chrome %>/js/'
                    },
                    // COPY IMAGES FILES
                    {
                        expand:true,
                        cwd:'images',
                        src:'*',
                        dest:'<%= meta.chrome %>/images/'
                    },
                    // COPY TWEAK CSS FILES
                    {
                        expand:true,
                        cwd:'css/',
                        src:[
                            'angular-csp.css',
                            'tweak.css'
                        ],
                        dest:'<%= meta.chrome %>/css/'
                    },
                    // COPY NOT MINIFIED CSS LIBRARIES FILES
                    {
                        expand:true,
                        cwd:'lib/',
                        src:[
                            'bootstrap/dist/css/bootstrap.min.css',
                            'bootstrap/dist/fonts/*',
                            'normalize-css/normalize.css'
                        ],
                        dest:'<%= meta.chrome %>/css/'
                    },
                    // COPY BACKGROUND SCRIPT
                    {
                        src:'background.js',
                        dest:'<%= meta.chrome %>/'
                    },
                    // COPY PARTIALS
                    {
                        expand:true,
                        cwd:'<%= meta.build %>',
                        src:'partials.tpl',
                        dest:'<%= meta.chrome %>/partials/'
                    }
                ]
            },
            cordova:{
                expand:true,
                cwd:'<%= meta.web %>',
                src:['*.*', '**/*.*'],
                dest:'<%= meta.build %>/cordova/www/'
            },
            firefoxos:{
                expand:true,
                cwd:'<%= meta.web %>/',
                src:['*.*', '**/*.*'],
                dest:'<%= meta.firefoxos %>/www/'
            }
        },

        preprocess:{
            debug:{
                options:{
                    context:{
                        DEBUG:true
                    }
                },
                files:{
                    '<%= meta.web %>/index.html':'index.html'
                }
            },
            web:{
                options:{
                    context:{
                        WEB:true,
                        AUTHOR:'<%= meta.author %>',
                        NAME:'<%= meta.pkg.name %>',
                        DESCRIPTION:'<%= meta.pkg.description %>',
                        KEYWORDS:'<%= meta.pkg.keywords %>',
                        MINJS:true
                    }
                },
                files:{
                    '<%= meta.web %>/index.html':'index.html'
                }
            },
            chrome:{
                options:{
                    context:{
                        CSP:true,
                        VERSION:'<%= meta.pkg.version %>',
                        NAME:'<%= meta.pkg.name %>',
                        DESCRIPTION:'<%= meta.pkg.description %>',
                        MINJS:true
                    }
                },
                files:{
                    '<%= meta.chrome %>/index.html':'index.html',
                    '<%= meta.chrome %>/manifest.json':'manifest.js'
                }
            },
            cordova:{
                options:{
                    context:{
                        WEB:true,
                        MINJS:true,
                        CORDOVA:true,
                        AUTHOR:'<%= meta.pkg.author %>',
                        NAME:'<%= meta.pkg.name %>',
                        DESCRIPTION:'<%= meta.pkg.description %>',
                        VERSION:'<%= meta.pkg.version %>'
                    }
                },
                files:{
                    '<%= meta.build %>/cordova/www/index.html':'index.html',
                    '<%= meta.build %>/cordova/config.xml':'config.xml'
                }
            }
        },

        compress: {
            firefoxos: {
                options: {
                    archive: '<%= meta.firefoxos %>/package.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= meta.firefoxos %>/www',
                        src: ['**'],
                        dest: '',
                        flattne: true
                    }
                ]
            }
        },

        cordovacli:{
            cordova:{
                options:{
                    command:['create', 'platform', 'plugin'],
                    platforms:['android'],
                    plugins: ['org.apache.cordova.inappbrowser'],
                    path:'build/cordova/',
                    id:'com.app.newsreader',
                    name:'<%= meta.pkg.name %>'
                }
            }
        },

        jshint:{
            files:[
                'Gruntfile.js',
                'app/**/*.js',
                'tests/**/*.js'
            ],
            options:{
                // options here to override JSHint defaults
                globals:{
                    console:true
                }
            }
        },

        watch:{
            // this watches for changes in the app directory and runs the concat
            // and wrap tasks if something changed
            concat:{
                files:[
                    'app/**/*.js',
                    'app/**/*.html',
                    'css/*.css',
                    'Gruntfile.js'
                ],
                tasks:['debug']
            }
        }

    });

    grunt.registerTask('firefoxosmanifest', function (key, value) {
        var config = grunt.config('meta');
        var projectFile = config.firefoxos + '/www/manifest.webapp';

        if (!grunt.file.exists(projectFile)) {
            grunt.log.error("file " + projectFile + " not found");
            grunt.log.writeln("creating " + projectFile + "file");
        }

        var manifest = {
            "launch_path":"/" + config.pkg.main,
            "installs_allowed_from":[
                "*"
            ],
            "version":config.pkg.version,
            "name":config.pkg.name,
            "description":config.pkg.description,
            "developer":{
                "name":config.pkg.author,
                "url":config.pkg.url
            },
            "icons":{
                "60":"/images/document.png",
                "128":"/images/document.png"
            }
        };

        grunt.file.write(projectFile, JSON.stringify(manifest, null, 2));
    });

    grunt.registerTask('init', ['mkdir:init']);

    grunt.registerTask('debug',
        [
            'jshint',
            'clean:web',
            'clean:jsfiles',
            'mkdir:web',
            'concat:app',
            'concat:modules',
            'concat:partials',
            'wrap',
            'preprocess:debug',
            'copy:debug',
            'clean:jsfiles'
        ]
    );

    grunt.registerTask('web',
        [
            'jshint',
            'clean:web',
            'mkdir:web',
            'concat:app',
            'concat:modulesweb',
            'concat:partials',
            'uglify:app',
            'uglify:modulesweb',
            'wrap',
            'preprocess:web',
            'copy:web',
            'clean:buildfiles'
        ]
    );

    grunt.registerTask('chrome',
        [
            'jshint',
            'clean:chrome', // clean build/chrome directory
            'mkdir:chrome',
            'concat:app',
            'concat:moduleschrome',
            'concat:partials',
            'uglify:app',
            'uglify:moduleschrome',
            'wrap',
            'preprocess:chrome',
            'copy:chrome',
            'clean:buildfiles'
        ]
    );

    grunt.registerTask('cordova', ['clean:cordovawww', 'web', 'copy:cordova', 'preprocess:cordova']);

    grunt.registerTask('firefoxos', ['clean:firefoxos', 'mkdir:firefoxos', 'web', 'copy:firefoxos', 'firefoxosmanifest']);
};
