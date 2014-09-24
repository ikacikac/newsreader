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

angular.module('owncloud').run(['$rootScope', '$location', 'UserSettings', 'localStorageService', function ($rootScope, $location, UserSettings, localStorageService) {

    UserSettings.userName = localStorageService.get('userName');
    UserSettings.password = localStorageService.get('password');
    UserSettings.hostName = localStorageService.get('hostName');

    $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
        if (!UserSettings.loggedIn) {
            $location.path('/login');
        }
    });

    $rootScope.$on('$routeChangeSuccess', function (event, currRoute, prevRoute) {
        if ($location.path() !== '/login') {
            //console.log('save the login data!');
            localStorageService.set('userName', UserSettings.userName);
            localStorageService.set('password', UserSettings.password);
            localStorageService.set('hostName', UserSettings.hostName);
        }
    });

}]);