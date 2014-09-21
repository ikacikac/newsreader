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

(function () {
    var owncloud = angular.module('owncloud', ['LocalStorageModule']);

    owncloud.config(['$httpProvider', '$provide', function ($httpProvider, $provide) {
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

    owncloud.run(['$rootScope', '$location', 'UserSettings', 'localStorageService', function($rootScope, $location, UserSettings, localStorageService){

        UserSettings.userName = localStorageService.get('userName');
        UserSettings.password = localStorageService.get('password');
        UserSettings.hostName = localStorageService.get('hostName');

        $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
            if (!UserSettings.loggedIn) {
                $location.path('/login');
            }
        });

        $rootScope.$on('$routeChangeSuccess', function(event, currRoute, prevRoute){
            if ($location.path() !== '/login') {
                //console.log('save the login data!');
                localStorageService.set('userName',UserSettings.userName);
                localStorageService.set('password',UserSettings.password);
                localStorageService.set('hostName',UserSettings.hostName);
            }
        });

    }]);

    owncloud.service('OwnCloudSettings', [function () {
        return {
            apiInfix:'/index.php/apps/news/api/v1-2'
        };
    }]);

    owncloud.service('UserSettings', [function () {
        return {
            userName:'',
            password:'',
            hostName:'',
            loggedIn: false
        };
    }]);

    owncloud.service('OwnCloudServices', ['$http', '$q', 'OwnCloudSettings', 'UserSettings', function ($http, $q, OwnCloudSettings, UserSettings) {

        var batchSize = 20;

        var folders = {
            list: null,
            map: {}
        };
        var feeds = {
            list: null,
            map: {}
        };

        /*
         HELPER FUNCTIONS
         */

        var successFn = function (response) {
            return response.data;
        };

        var errorFn = function (response) {
            return {message:'Error in communication',status:response.status};
        };

        var foldersSuccessFn = function (response) {
            folders.list = response.data.folders;

            folders.map = {};

            angular.forEach(folders.list, function(val, key){
                folders.map[val.id] = key;
            });
            return response.data;
        };

        var feedsSuccessFn = function (response) {
            feeds.list = response.data.feeds;

            feeds.map = {};

            angular.forEach(feeds.list, function(val, key){
                feeds.map[val.id] = key;
            });
            return response.data;
        };

        var getFolderById = function(id){
            return folders.list[folders.map[id]];
        };

        var getFeedById = function(id){
            return feeds.list[feeds.map[id]];
        };
//        var generateArticlesMap = function (articlesArray) {
//            var tmpMap = {};
//            angular.forEach(articlesArray, function (val, key) {
//                tmpMap[val.id] = key;
//            });
//            return tmpMap;
//        };

        /*
         HELPER FUNCTIONS END
         */

        /*
         API COMMUNICATION FUNCTIONS
         */

        var getAllArticles = function (id, lastArticleId) {
            var params =
            {
                "batchSize":batchSize, //  the number of items that should be returned, defaults to 20
                "offset":lastArticleId, // only return older (lower than equal that id) items than the one with id 30
                "type":3, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                "id":0, // the id of the folder or feed, Use 0 for Starred and All
                "getRead":true // if true it returns all items, false returns only unread items
            };

            return $http({method:'GET', params:params, url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items'})
                .then(successFn, errorFn);
        };

        var getStarredArticles = function (id, lastArticleId) {
            var params =
            {
                "batchSize":batchSize, //  the number of items that should be returned, defaults to 20
                "offset":lastArticleId, // only return older (lower than equal that id) items than the one with id 30
                "type":2, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                "id":0, // the id of the folder or feed, Use 0 for Starred and All
                "getRead":true // if true it returns all items, false returns only unread items
            };

            return $http({method:'GET', params:params, url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items'})
                .then(successFn, errorFn);
        };

//        var setMultipleArticlesAsStarred = function (articles) {
//            return $http({method:'PUT', params: articles, url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/star/multiple'})
//                .then(successFn, errorFn);
//        };
//
//        var setMultipleArticlesAsUnstarred = function (articles) {
//            return $http({method:'PUT', params: articles, url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/unstar/multiple'})
//                .then(successFn, errorFn);
//        };

        var setArticleAsStarred = function(feedId, guidHash){
            return $http({method:'PUT', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/'+feedId+'/'+guidHash+'/star'})
                .then(successFn, errorFn);
        };

        var setArticleAsUnstarred = function(feedId, guidHash){
            return $http({method:'PUT', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/'+feedId+'/'+guidHash+'/unstar'})
                .then(successFn, errorFn);
        };

        var setArticleAsRead = function(id){
            return $http({method:'PUT', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/'+id+'/read'})
                .then(successFn, errorFn);
        };

        var setArticleAsUnread = function(id){
            return $http({method:'PUT', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/'+id+'/unread'})
                .then(successFn, errorFn);
        };

        var getArticlesByFolderId = function (folderId, lastArticleId) {
            var params =
            {
                "batchSize":batchSize, //  the number of items that should be returned, defaults to 20
                "offset":lastArticleId, // only return older (lower than equal that id) items than the one with id 30
                "type":1, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                "id":folderId, // the id of the folder or feed, Use 0 for Starred and All
                "getRead":true // if true it returns all items, false returns only unread items
            };

            return $http({method:'GET', params:params, url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items'})
                .then(successFn, errorFn);
        };

        var getArticlesByFeedId = function (feedId, lastArticleId) {
            var params =
            {
                "batchSize":batchSize, //  the number of items that should be returned, defaults to 20
                "offset":lastArticleId, // only return older (lower than equal that id) items than the one with id 30
                "type":0, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
                "id":feedId, // the id of the folder or feed, Use 0 for Starred and All
                "getRead":true // if true it returns all items, false returns only unread items
            };

            return $http({method:'GET', params:params, url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/items'})
                .then(successFn, errorFn);
        };

        var getAllFolders = function () {
            return $http({method:'GET', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/folders'})
                .then(foldersSuccessFn, errorFn);
        };

        var deleteFolder = function (folderId) {
            return $http({method:'DELETE', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/folders/' + folderId})
                .then(successFn, errorFn);
        };

        var setAllFolderArticlesRead = function (folderId, newestArticleId) {
            var params = {
                "newestItemId":newestArticleId
            };

            return $http({method:'PUT', params:params, url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/folders/' + folderId + '/read'})
                .then(successFn, errorFn);
        };

        var getAllFeeds = function () {
            return $http({method:'GET', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/feeds'})
                .then(feedsSuccessFn, errorFn);
        };

        var deleteFeed = function (feedId) {
            return $http({method:'DELETE', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/feeds/' + feedId})
                .then(successFn, errorFn);
        };

        var setAllFeedArticlesRead = function (feedId, newestArticleId) {
            var params = {
                "newestItemId":newestArticleId
            };

            return $http({method:'PUT', params:params, url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/feeds/' + feedId + '/read'})
                .then(successFn, errorFn);
        };

        var login = function () {
            return $http({method:'GET', url:UserSettings.hostName + OwnCloudSettings.apiInfix + '/version'})
                .then(successFn, errorFn);
        };

        /*
         API COMMUNICATION FUNCTIONS END
         */

        return {
            getAllArticles:getAllArticles,
            getStarredArticles:getStarredArticles,
            setArticleAsRead: setArticleAsRead,
            setArticleAsUnread: setArticleAsUnread,
            setArticleAsStarred: setArticleAsStarred,
            setArticleAsUnstarred: setArticleAsUnstarred,
            getArticlesByFolderId:getArticlesByFolderId,
            getArticlesByFeedId:getArticlesByFeedId,
            getFolders:getAllFolders,
            getFolderById:getFolderById,
            getFeedById:getFeedById,
            getFeeds:getAllFeeds,
            deleteFolder:deleteFolder,
            deleteFeed:deleteFeed,
            setAllFolderArticlesRead: setAllFolderArticlesRead,
            setAllFeedArticlesRead: setAllFeedArticlesRead,
            login:login
        };

    }]);

    owncloud.service('OwnCloudTest', ['$http', function($http){
        return {
            //This method is only used for testing AuthInterceptor purpose
            login : function (url) {
                return $http({method:'GET', url: url})
                    .then(function(response){return response;}, function(response){return response;});
            }
        };
    }]);
})();
