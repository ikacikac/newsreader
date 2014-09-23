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
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-wrap');

    grunt.initConfig({
        meta:{
            pkg:grunt.file.readJSON('package.json'),
            version:'<%= meta.pkg.version %>',
            name:'<%= meta.pkg.name %>',
            description:'<%= meta.pkg.description %>',
            build:'build',
            web:'build/web',
            chrome:'build/chrome'
        },

        concat:{
            app:{
                options:{
                    stripBanners:true,
                    banner:'/**\n' +
                        ' * Copyright (c) 2014, Ilija Lazarevic ' +
                        '<ikac.ikax@gmail.com> \n' +
                        ' * This file is licensed under the MIT Licence\n' +
                        ' * See the LICENCE file.\n */\n\n'
                },
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
            modules:{
                options:{
                    stripBanners:true,
                    banner:'/**\n' +
                        ' * Copyright (c) 2014, Ilija Lazarevic ' +
                        '<ikac.ikax@gmail.com> \n' +
                        ' * This file is licensed under the MIT Licence\n' +
                        ' * See the LICENCE file.\n */\n\n'
                },
                src:[
                    'app/modules/*.js',
                    '!app/modules/*Spec.js'
                ],
                dest:'<%= meta.build %>/modules.js'
            },
            partials: {
                options:{
                    stripBanners:true
                },
                src: 'app/**/*.html',
                dest: '<%= meta.web %>/partials/partials.tpl'
            }
        },

        uglify: {
            options: {
                stripBanners:true,
                banner:'/**\n' +
                    ' * Copyright (c) 2014, Ilija Lazarevic ' +
                    '<ikac.ikax@gmail.com> \n' +
                    ' * This file is licensed under the MIT Licence\n' +
                    ' * See the LICENCE file.\n */\n\n',
//                wrap: true,
                mangle: true
            },
            app: {
                files: {
                    '<%= meta.build %>/app.min.js' : [
                        'app/app.js',
                        'app/articles/ArticlesController.js',
                        'app/feeds/FeedsController.js',
                        'app/folders/FoldersController.js',
                        'app/login/LoginController.js',
                        'app/menu/MenuController.js',
                        'app/directives/dock/nwrFloatPalette.js',
                        'app/directives/nwrOpenLink.js'
                    ],
                    '<%= meta.build %>/modules.min.js': [
                        'app/modules/owncloud.js'
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
            jsfiles:[
                '<%= meta.build %>/*.js'
            ],
            chrome: [
                '<%= meta.chrome %>/*'
            ]
        },

        mkdir:{
            init: {
                options:{
                    mode: 0755,
                    create: [
                        '<%= meta.build %>',
                        '<%= meta.build %>/android',
                        '<%= meta.build %>/chrome',
                        '<%= meta.build %>/ffos',
                        '<%= meta.web %>'
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
// ,
//                    {
//                        expand:true,
//                        cwd: 'app/',
//                        src: [
//                            'articles/articles.html',
//                            'directives/dock/palette.html',
//                            'feeds/feeds.html',
//                            'folders/folders.html',
//                            'login/login.html',
//                            'menu/menu.html'
//                        ],
//                        dest: '<%= meta.web %>/partials/',
//                        flatten: true
//                    }
                ]
            },
            web: {
                files: [
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
                    }
//                    ,
//                    {
//                        expand:true,
//                        cwd: 'app/',
//                        src: [
//                            'articles/articles.html',
//                            'directives/dock/palette.html',
//                            'feeds/feeds.html',
//                            'folders/folders.html',
//                            'login/login.html',
//                            'menu/menu.html'
//                        ],
//                        dest: '<%= meta.web %>/partials/',
//                        flatten: true
//                    }
                ]
            },
            chrome: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= meta.web %>/',
                        src: [
                            'css/**',
                            'images/**',
                            'js/**',
                            'partials/**'
                        ],
                        dest: '<%= meta.chrome %>'
                    },
                    {
                        src: [
                            'css/angular-csp.css',
                            'background.js'
                        ],
                        dest: '<%= meta.chrome %>/'
                    }
                ]
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
                        WEB:true
                    }
                },
                files:{
                    '<%= meta.web %>/index.html':'index.html'
                }
            },
            chrome: {
                options : {
                   context: {
                       CHROME: true,
                       VERSION : '<%= meta.pkg.version %>',
                       NAME : '<%= meta.pkg.name %>',
                       DESCRIPTION : '<%= meta.pkg.description %>'
                   }
                },
                files: {
                    '<%= meta.chrome %>/index.html': 'index.html',
                    '<%= meta.chrome %>/manifest.json' : 'manifest.json.tpl'
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

    // make tasks available under simpler commands
    //grunt.registerTask('build', ['jshint', 'concat', 'wrap']);

    grunt.registerTask('init', ['mkdir:init']);

    grunt.registerTask('debug',
        [
            'jshint',
            'clean:web',
            'clean:jsfiles',
            'mkdir:web',
            'concat',
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
            'clean:jsfiles',
            'mkdir:web',
            'uglify',
            'concat:partials',
            'wrap',
            'preprocess:web',
            'copy:web',
            'clean:jsfiles'
        ]
    );

    grunt.registerTask('chrome',
        [
            'web',
            'clean:chrome',
            'preprocess:chrome',
            'copy:chrome'
        ]
    );
};
