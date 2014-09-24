/*
 * The MIT License (MIT)
 *
 * Copyright (c) 9/23/14 Ilija Lazarevic
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

angular.module('owncloud', ['LocalStorageModule']);

angular.module('owncloud').config(['$httpProvider', '$provide', function ($httpProvider, $provide) {
    $provide.factory('AuthInterceptor', ['UserSettings', '$q', function (UserSettings, $q) {
        return {
            request:function (config) {
//                    console.log(config.url);
                // only set auth headers if url matches the api url
                if (config.url.indexOf(UserSettings.hostName) === 0) {
                    var auth = btoa(UserSettings.userName + ':' + UserSettings.password);
                    config.headers.Authorization = 'Basic ' + auth;
                }
                return config || $q.when(config);
            }
        };
    }]);
    $httpProvider.interceptors.push('AuthInterceptor');
}]);