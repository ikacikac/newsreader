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

angular.module('newsreader', ['ngRoute', 'ngSanitize', 'owncloud', 'pasvaz.bindonce']);

angular.module('newsreader').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/articles/all', {
        controller:'ArticlesCtrl',
        templateUrl:'partials/articles.tpl',
        resolve:{
            type:function () {
                return 'all';
            }
        }
    }).when('/articles/star', {
        controller:'ArticlesCtrl',
        templateUrl:'partials/articles.tpl',
        resolve:{
            type:function () {
                return 'star';
            }
        }
    }).when('/folders', {
        controller:'FoldersCtrl',
        templateUrl:'partials/folders.tpl'
    }).when('/feeds', {
        controller:'FeedsCtrl',
        templateUrl:'partials/feeds.tpl'
    }).when('/folder/:id/articles', {
        controller:'ArticlesCtrl',
        templateUrl:'partials/articles.tpl',
        resolve:{
            type:function () {
                return 'folder';
            }
        }
    }).when('/feed/:id/articles', {
        controller:'ArticlesCtrl',
        templateUrl:'partials/articles.tpl',
        resolve:{
            type:function () {
                return 'feed';
            }
        }
    }).when('/login',{
        controller: 'LoginCtrl',
        templateUrl: 'partials/login.tpl'
    })
    .otherwise({
        redirectTo:'/articles/all'
    });
}]);

angular.module('newsreader').factory('$templateCache',['$cacheFactory', '$http', '$injector', function($cacheFactory, $http, $injector) {
    var cache = $cacheFactory('templates');
    var allTplPromise;

    return {
        get: function(url) {
            var fromCache = cache.get(url);

            // already have required template in the cache
            if (fromCache) {
                return fromCache;
            }

            // first template request ever - get the all tpl file
            if (!allTplPromise) {
                allTplPromise = $http.get('partials/partials.tpl').then(function(response) {
                    // compile the response, which will put stuff into the cache
                    $injector.get('$compile')(response.data);
                    return response;
                });
            }

            // return the all-tpl promise to all template requests
            return allTplPromise.then(function(response) {
                return {
                    status: response.status,
                    data: cache.get(url)
                };
            });
        },

        put: function(key, value) {
            cache.put(key, value);
        }
    };
}]);