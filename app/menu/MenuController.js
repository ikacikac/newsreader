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

angular.module('newsreader').controller('MenuCtrl', ['$scope', '$location', 'OwnCloudServices', function ($scope, $location, OwnCloudServices) {
    $scope.toShow = {
        menu:false,
        header:false,
        button:true
    };

    $scope.hideMenu = function () {
        $scope.toShow.menu = false;
    };

    $scope.$on('$locationChangeSuccess', function () {
        var path = $location.path();
        var id = null;

        if (path === '/login') {
            $scope.toShow.header = false;
        } else if (path.length !== 0) {
            $scope.toShow.header = true;
        }

        if (path === '/articles/all') {
            $scope.title = 'All articles';

        } else if (path === '/articles/star') {
            $scope.title = 'Starred articles';

        } else if (path === '/folders') {
            $scope.title = 'Folders list';

        } else if (path === '/feeds') {
            $scope.title = 'Feeds list';

        } else if (/\/folder\/[0-9]*\/articles/.test(path)) {
            $scope.title = 'Folder articles';
            id = parseInt(path.match(/\/([0-9]*)\//m)[1]);
            $scope.title = OwnCloudServices.getFolderById(id).name + ' articles';

        } else if (/\/feed\/[0-9]*\/articles/.test(path)) {
            $scope.title = 'Feed articles';
            id = parseInt(path.match(/\/([0-9]*)\//m)[1]);
            $scope.title = OwnCloudServices.getFeedById(id).title + ' articles';
        } else {
            $scope.title = 'Unknown';
        }

    });

    $scope.goTo = function(url){
        $location.path(url);
    };

    $scope.$on('$destroy', function () {
        delete $scope.toShow;
        delete $scope.hideMenu;
    });

}]);