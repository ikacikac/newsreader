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

angular.module('newsreader').controller('ArticlesCtrl', ['$scope', '$routeParams', 'OwnCloudServices', 'type', function ($scope, $routeParams, OwnCloudServices, type) {

    $scope.lastArticleId = 0;

    $scope.articles = [];
    $scope.alertMessage = null;

    $scope.noMoreArticles = false;
    $scope.type = type;

    $scope.articlesMap = {};

    $scope.getArticles = function () {
        $scope.map[$scope.type].fun($routeParams.id, $scope.lastArticleId).then(function (response) {

            if (response.items) {
                response = response.items;
                if (response.length > 0 && typeof(response[0]) != 'string') {

                    angular.forEach(response, function (val, key) {
                        val.selected = false;
                    });

                    $scope.articles = $scope.articles.concat(response);
                    $scope.lastArticleId = response[response.length - 1].id;

                    angular.forEach($scope.articles, function (val, key) {
                        $scope.articlesMap[val.id] = key;
                    });

                } else if (response.length === 0) {
                    $scope.noMoreArticles = true;
                }
            } else {
                $scope.alertMessage = response.message;
            }
//            console.log(articlesMap);


        });
    };

    $scope.toggleStarred = function (id, feedId, guidHash) {
        var article = $scope.articles[$scope.articlesMap[id]];
        if (article.starred) {
            OwnCloudServices.setArticleAsUnstarred(feedId, guidHash).then(function (response) {
                if (response && response.length === 0) {
                    article.starred = false;
                }

            });
        } else {
            OwnCloudServices.setArticleAsStarred(feedId, guidHash).then(function (response) {
                if (response && response.length === 0) {
                    article.starred = true;
                }
            });
        }
    };

    $scope.toggleRead = function (id) {
        var article = $scope.articles[$scope.articlesMap[id]];

        if (article.unread) {
            OwnCloudServices.setArticleAsRead(id).then(function (response) {
                if (response && response.length === 0) {
                    article.unread = false;
                }
            });
        } else {
            OwnCloudServices.setArticleAsUnread(id).then(function (response) {
                if (response && response.length === 0) {
                    article.unread = true;
                }
//                console.log('marked as unread');
            });
        }
    };

    $scope.unselectAll = function () {
        angular.forEach($scope.articles, function (val, key) {
            val.selected = false;
        });
    };

    $scope.selectAll = function () {
        angular.forEach($scope.articles, function (val, key) {
            val.selected = true;
        });
    };

    $scope.map = {
        all:{
            fun:OwnCloudServices.getAllArticles
        },
        star:{
            fun:OwnCloudServices.getStarredArticles
        },
        folder:{
            fun:OwnCloudServices.getArticlesByFolderId
        },
        feed:{
            fun:OwnCloudServices.getArticlesByFeedId
        }
    };

    $scope.getArticles();

    $scope.$on('$destroy', function () {
        delete $scope.articles;
        $scope.articles = null;
        $scope.map = null;
        delete $scope.getAllArticles;
        delete $scope.getStarredArticles;
        delete $scope.getArticlesByFolderId;
        delete $scope.getArticlesByFeedId;
        delete $scope.toggleStarred;
        delete $scope.toggleRead;
    });

}]);