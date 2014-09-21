/*
 * The MIT License (MIT)
 *
 * Copyright (c) 9/21/14 Ilija Lazarevic
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

describe('OwnCloud unit test:', function () {

    var $httpProvider, $httpBackend, $rootScope, localStorageService, OwnCloudSettings, OwnCloudServices, UserSettings;

    beforeEach(module('owncloud', function (_$httpProvider_) {

        $httpProvider = _$httpProvider_;

    }));

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _localStorageService_, _UserSettings_, _OwnCloudServices_, _OwnCloudSettings_) {

        localStorageService = _localStorageService_;
        UserSettings = _UserSettings_;
        OwnCloudSettings = _OwnCloudSettings_;
        OwnCloudServices = _OwnCloudServices_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;

    }));

    describe('Services should have correct default values', function () {

        it('UserSettings field should have correct default values', function () {
            expect(UserSettings.userName).toBeNull();
            expect(UserSettings.password).toBeNull();
            expect(UserSettings.hostName).toBeNull();
            expect(UserSettings.loggedIn).toBeFalsy();
        });

        it('OwnCloudSettings API infix should have correct value', function () {
            expect(OwnCloudSettings.apiInfix).toBe('/index.php/apps/news/api/v1-2');
        });

        afterEach(function () {
            UserSettings.userName = null;
            UserSettings.password = null;
            UserSettings.hostName = null;
            UserSettings.loggedIn = false;
        });

    });

    describe('localStorageService should work properly and', function () {

        beforeEach(function () {
            UserSettings.userName = 'test';
            UserSettings.password = 'test';
            UserSettings.hostName = 'http://test.com';
            UserSettings.loggedIn = false;
        });

        it('should be empty', function () {
            expect(localStorageService.get('userName')).toBeNull();
            expect(localStorageService.get('password')).toBeNull();
            expect(localStorageService.get('hostName')).toBeNull();
        });

        it('if user is not logged in, user should be redirected to login page', inject(function ($location) {
            $location.path('/articles/all');
            $rootScope.$broadcast('$routeChangeStart');
            expect($location.path()).toBe('/login');
        }));

        it('if user is logged in and forwarded to pages user data should be saved to storage', inject(function ($location) {
            UserSettings.loggedIn = true;
            $location.path('/articles/all');
            $rootScope.$broadcast('$routeChangeSuccess');
            expect(localStorageService.get('userName')).toBe(UserSettings.userName);
            expect(localStorageService.get('password')).toBe(UserSettings.password);
            expect(localStorageService.get('hostName')).toBe(UserSettings.hostName);
        }));

        afterEach(function () {
            localStorageService.clearAll();
        });
    });

    describe('AuthInterceptor is working properly', function () {

        beforeEach(function () {
            UserSettings.userName = 'owncloud';
            UserSettings.password = 'owncloud';
            UserSettings.hostName = 'http://owncloud.com';
        });

        it('AuthInterceptor in httpProvider\'s interceptors array', function () {
            expect($httpProvider.interceptors).toContain('AuthInterceptor');
        });

        it('and not appending auth headers if URL is not correct', inject(function (OwnCloudTest) {
            $httpBackend.expect('GET', 'http://test.com/index.php/apps/news/api/v1-2/version', null,function (headers) {
                expect(headers.Authorization).not.toBeDefined();
                return headers;
            }).respond(200);

            OwnCloudTest.login('http://test.com/index.php/apps/news/api/v1-2/version');
            $httpBackend.flush();
        }));

        it('and appending auth headers if URL is correct', function () {
            var auth = 'Basic ' + btoa(UserSettings.userName + ':' + UserSettings.password);
            $httpBackend.expect('GET', UserSettings.hostName + OwnCloudSettings.apiInfix + '/version', null,function (headers) {
                expect(headers.Authorization).toBeDefined();
                expect(headers.Authorization).toBe(auth);
                return headers;
            }).respond(200);

            OwnCloudServices.login();
            $httpBackend.flush();
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

    });

    describe('OwnCloudServices method', function () {

        //LOGIN TEST

        it('login should make request', function(){
            $httpBackend.expectGET(UserSettings.hostName + OwnCloudSettings.apiInfix + '/version').respond(200);
            OwnCloudServices.login();
            $httpBackend.flush();
        });

        //ARTICLES TEST

        it('getAllArticles should make request', function () {
            var lastArticleId = 2;
            $httpBackend.expectGET(UserSettings.hostName + OwnCloudSettings.apiInfix + '/items?batchSize=20&getRead=true&id=0&offset=' + lastArticleId + '&type=3').respond(200);
            OwnCloudServices.getAllArticles(0, lastArticleId);
            $httpBackend.flush();
        });

        it('getStarredArticles should make request', function () {
            var lastArticleId = 2;
            $httpBackend.expectGET(UserSettings.hostName + OwnCloudSettings.apiInfix + '/items?batchSize=20&getRead=true&id=0&offset=' + lastArticleId + '&type=2').respond(200);
            OwnCloudServices.getStarredArticles(0, lastArticleId);
            $httpBackend.flush();
        });

        it('getArticlesByFolderId should make request', function () {
            var lastArticleId = 2;
            var folderId = 1;
            $httpBackend.expectGET(UserSettings.hostName + OwnCloudSettings.apiInfix + '/items?batchSize=20&getRead=true&id='+folderId+'&offset=' + lastArticleId + '&type=1').respond(200);
            OwnCloudServices.getArticlesByFolderId(folderId, lastArticleId);
            $httpBackend.flush();
        });

        it('getArticlesByFeedId should make request', function () {
            var lastArticleId = 2;
            var feedId = 1;
            $httpBackend.expectGET(UserSettings.hostName + OwnCloudSettings.apiInfix + '/items?batchSize=20&getRead=true&id='+feedId+'&offset=' + lastArticleId + '&type=0').respond(200);
            OwnCloudServices.getArticlesByFeedId(feedId, lastArticleId);
            $httpBackend.flush();
        });

        it('setArticleAsStarred should make request', function(){
            var feedId = 2;
            var guidHash = 'test';

            $httpBackend.expectPUT(UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/'+feedId+'/'+guidHash+'/star').respond(200);
            OwnCloudServices.setArticleAsStarred(feedId, guidHash);
            $httpBackend.flush();
        });

        it('setArticleAsUnstarred should make request', function(){
            var feedId = 2;
            var guidHash = 'test';

            $httpBackend.expectPUT(UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/'+feedId+'/'+guidHash+'/unstar').respond(200);
            OwnCloudServices.setArticleAsUnstarred(feedId, guidHash);
            $httpBackend.flush();
        });

        it('setArticleAsRead should make request', function(){
            var articleId = 2;

            $httpBackend.expectPUT(UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/'+articleId+'/read').respond(200);
            OwnCloudServices.setArticleAsRead(articleId);
            $httpBackend.flush();
        });

        it('setArticleAsUnread should make request', function(){
            var articleId = 2;

            $httpBackend.expectPUT(UserSettings.hostName + OwnCloudSettings.apiInfix + '/items/'+articleId+'/unread').respond(200);
            OwnCloudServices.setArticleAsUnread(articleId);
            $httpBackend.flush();
        });

        //FOLDERS TEST

        it('getFolders should make request', function () {
            var folders = {folders:[{id:2,name:'test folder'}]};
            $httpBackend.expectGET(UserSettings.hostName + OwnCloudSettings.apiInfix + '/folders').respond(200, folders);
            OwnCloudServices.getFolders();
            $httpBackend.flush();
        });

        it('deleteFolder should make request', function () {
            var folderId = 2;
            $httpBackend.expectDELETE(UserSettings.hostName + OwnCloudSettings.apiInfix + '/folders/'+folderId).respond(200);
            OwnCloudServices.deleteFolder(folderId);
            $httpBackend.flush();
        });

        it('setAllFolderArticlesRead should make request', function () {
            var folderId = 2;
            $httpBackend.expectPUT(UserSettings.hostName + OwnCloudSettings.apiInfix + '/folders/'+folderId+'/read').respond(200);
            OwnCloudServices.setAllFolderArticlesRead(folderId);
            $httpBackend.flush();
        });

        //FEEDS TEST

        it('getFeeds should make request', function () {
            var feeds = {feeds:[{id:2,name:'test feed'}]};
            $httpBackend.expectGET(UserSettings.hostName + OwnCloudSettings.apiInfix + '/feeds').respond(200, feeds);
            OwnCloudServices.getFeeds();
            $httpBackend.flush();
        });

        it('deleteFeed should make request', function () {
            var feedId = 2;
            $httpBackend.expectDELETE(UserSettings.hostName + OwnCloudSettings.apiInfix + '/feeds/'+feedId).respond(200);
            OwnCloudServices.deleteFeed(feedId);
            $httpBackend.flush();
        });

        it('setAllFeedArticlesRead should make request', function () {
            var feedId = 2;
            $httpBackend.expectPUT(UserSettings.hostName + OwnCloudSettings.apiInfix + '/feeds/'+feedId+'/read').respond(200);
            OwnCloudServices.setAllFeedArticlesRead(feedId);
            $httpBackend.flush();
        });

    });

//    describe(' Interceptor is pushed and', function(){
//    });
});