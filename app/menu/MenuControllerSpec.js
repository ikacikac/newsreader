/*
 * The MIT License (MIT)
 *
 * Copyright (c) 9/18/14 Ilija Lazarevic
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

describe('Menu Controller unit test:', function () {

    var $rootScope, scope, $location, $httpBackend;

    beforeEach(module('newsreader'));

    beforeEach(inject(function (_$rootScope_, _$location_, _$httpBackend_, $controller) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $location = _$location_;
        $httpBackend = _$httpBackend_;

        $controller('MenuCtrl', {$scope:scope});

        $rootScope.$broadcast('$locationChangeSuccess');
    }));

    it('scope variables should have initial values', function () {
        $location.path('/login');
        $rootScope.$digest();

        expect(scope.toShow.menu).toBe(false);
        expect(scope.toShow.header).toBe(false);
        expect(scope.toShow.button).toBe(true);
    });

    it('hideMenu method should hide menu', function () {
        scope.toShow.menu = true;
        scope.hideMenu();
        expect(scope.toShow.menu).toBe(false);
    });

    it('goTo method should change location', function() {
        $location.path('');
        scope.goTo('/articles/star');
        expect($location.path()).toBe('/articles/star');
    });

    describe('$locationChangeSuccess should have been emitted and ', function () {

        it('variable header is unchanged on /login path', function () {
            $location.path('/login');
            $rootScope.$digest();

            expect(scope.toShow.header).toBe(false);
        });

        it('variable header is true on path different than /login', function () {
            $location.path('/articles/all');
            $rootScope.$digest();

            expect(scope.toShow.header).toBe(true);
        });

        it('title is All articles for /articles/all location path', function () {
            $location.path('/articles/all');
            $rootScope.$digest();

            expect(scope.title).toBe('All articles');
        });

        it('title is Starred articles for /articles/star location path', function () {
            $location.path('/articles/star');
            $rootScope.$digest();

            expect(scope.title).toBe('Starred articles');
        });

        it('title is Folders list for /folders location path', function () {
            $location.path('/folders');
            $rootScope.$digest();

            expect(scope.title).toBe('Folders list');
        });

        it('title is Feeds list for /feeds location path', function () {
            $location.path('/feeds');
            $rootScope.$digest();

            expect(scope.title).toBe('Feeds list');
        });

        describe('folders and feeds list should be loaded and', function () {

            var OwnCloudServices;

            beforeEach(inject(function(_OwnCloudServices_){
                OwnCloudServices = _OwnCloudServices_;
                $httpBackend.expectGET().respond(200, {folders:[{id:0, name:'Test folder'}]});
                $httpBackend.expectGET().respond(200, {feeds:[{id:0, title:'Test feed'}]});
                OwnCloudServices.getFolders();
                OwnCloudServices.getFeeds();
                $httpBackend.flush();
             }));

            it('title is Foler ...', function(){
                $location.path('/folder/0/articles');
                spyOn(OwnCloudServices,'getFolderById').andCallThrough();
                $rootScope.$digest();

                expect(OwnCloudServices.getFolderById).toHaveBeenCalledWith(0);
                expect(scope.title).toBe('Test folder articles');
            });

            it('title is Feed ...', function(){
                $location.path('/feed/0/articles');
                spyOn(OwnCloudServices,'getFeedById').andCallThrough();
                $rootScope.$digest();

                expect(OwnCloudServices.getFeedById).toHaveBeenCalledWith(0);
                expect(scope.title).toBe('Test feed articles');
            });

            afterEach(function(){
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

        });


    });


});