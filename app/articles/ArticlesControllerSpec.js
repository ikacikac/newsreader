/*
 * The MIT License (MIT)
 *
 * Copyright (c) 9/17/14 Ilija Lazarevic
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


describe('Articles Controller test unit:', function () {

    beforeEach(module('newsreader'));

    var scope, createController, $httpBackend, OwnCloudServices, $routeParams;

    beforeEach(inject(function ($rootScope, $controller, _$httpBackend_, _$routeParams_, _OwnCloudServices_) {
        scope = $rootScope.$new();

        scope.lastArticleId = 0;

        createController = function (type) {
            return $controller('ArticlesCtrl', {$scope:scope, type:type});
        };

        OwnCloudServices = _OwnCloudServices_;
        $routeParams = _$routeParams_;
        $httpBackend = _$httpBackend_;

        $routeParams.id = 0;

        this.addMatchers({
            toHaveAllKeysWithValues:function (key, val) {
                var array = this.actual;


                if (arguments.length !== 2 ||
                    ( Object.prototype.toString.call(array) !== '[object Array]' ||
                        Object.prototype.toString.call(key) !== '[object String]' ||
                        Object.prototype.toString.call(val) !== '[object Boolean]')
                    )
                {
                    throw new Error('arrayShouldHaveKeysWithValues should be called with 3 arguments (with types array,string,boolean)');
                }

                this.message = function () {
                    return 'There are different values in array than those that are wanted';
                };
                for (var i = 0; i < array.length; i++) {
                    if (array[i][key] !== val) {
                        return false;
                    }
                }
                return true;
            }
        });
    }));

    describe('when viewing ALL articles', function () {

        beforeEach(function () {

            scope.lastArticleId = 0;
            scope.articles = [];

            $httpBackend.expectGET().respond(200, {items:[{id:1, starred:false, selected:false, unread:true}]});
            createController('all');
            $httpBackend.flush();

        });

        //getAllArticles method testing

        it('method getAllArticles should be called', function () {
            $httpBackend.expectGET().respond(200, {items:[
                {id:2, selected:false}
            ]});

            spyOn(scope.map[scope.type], 'fun').andCallThrough();
            scope.getArticles();
            $httpBackend.flush();

            expect(scope.map[scope.type].fun).toHaveBeenCalled();

            //lastArticleId is not the one from this GET but the
            //one that was before this one, that is id from first
            //GET in beforeEach!!!
            expect(scope.map[scope.type].fun).toHaveBeenCalledWith($routeParams.id, 1);
        });

        it('method getAllArticles should return parsed array', function(){
            expect(scope.articles).toContain({id:1, starred:false, selected:false, unread:true});
        });

        it('method getAllArticles should return error message', function () {
            $httpBackend.expectGET().respond(404);

            scope.getArticles();
            $httpBackend.flush();

            expect(scope.alertMessage).toBe('Error in communication');
        });

        // toggleStarred method testing

        it('method toggleStarred on unstarred article should make it starred',function(){
            $httpBackend.expectPUT().respond(200,[]);

            spyOn(OwnCloudServices, 'setArticleAsStarred').andCallThrough();
            scope.toggleStarred(1,1,0);
            $httpBackend.flush();

            expect(OwnCloudServices.setArticleAsStarred).toHaveBeenCalled();
            expect(scope.articles[0].starred).toBe(true);
        });

        it('method toggleStarred on unstarred article should not do anything in case of API error',function(){
            $httpBackend.expectPUT().respond(404,[]);

            spyOn(OwnCloudServices, 'setArticleAsStarred').andCallThrough();
            scope.toggleStarred(1,1,0);
            $httpBackend.flush();

            expect(OwnCloudServices.setArticleAsStarred).toHaveBeenCalled();
            expect(scope.articles[0].starred).toBe(false);
        });

        it('method toggleStarred on starred article should make it unstarred',function(){
            $httpBackend.expectPUT().respond(200,[]);
            scope.articles[0].starred = true;

            spyOn(OwnCloudServices, 'setArticleAsUnstarred').andCallThrough();
            scope.toggleStarred(1,1,0);
            $httpBackend.flush();

            expect(OwnCloudServices.setArticleAsUnstarred).toHaveBeenCalled();
            expect(scope.articles[0].starred).toBe(false);
        });

        it('method toggleStarred on starred article should not do anything in case of API error',function(){
            $httpBackend.expectPUT().respond(404,[]);
            scope.articles[0].starred = true;

            spyOn(OwnCloudServices, 'setArticleAsUnstarred').andCallThrough();
            scope.toggleStarred(1,1,0);
            $httpBackend.flush();

            expect(OwnCloudServices.setArticleAsUnstarred).toHaveBeenCalled();
            expect(scope.articles[0].starred).toBe(true);
        });

        // toggleRead method testing

        it('method toggleRead on unread article should make it read', function(){
            $httpBackend.expectPUT().respond(200,[]);

            spyOn(OwnCloudServices,'setArticleAsRead').andCallThrough();
            scope.toggleRead(1);
            $httpBackend.flush();

            expect(OwnCloudServices.setArticleAsRead).toHaveBeenCalled();
            expect(scope.articles[0].unread).toBe(false);
        });

        it('method toggleRead on unread article should not do anything in case of API error', function(){
            $httpBackend.expectPUT().respond(404,[]);

            spyOn(OwnCloudServices,'setArticleAsRead').andCallThrough();
            scope.toggleRead(1);
            $httpBackend.flush();

            expect(OwnCloudServices.setArticleAsRead).toHaveBeenCalled();
            expect(scope.articles[0].unread).toBe(true);
        });

        it('method toggleRead on read article should make it unread', function(){
            $httpBackend.expectPUT().respond(200,[]);

            scope.articles[0].unread = false;
            spyOn(OwnCloudServices,'setArticleAsUnread').andCallThrough();
            scope.toggleRead(1);
            $httpBackend.flush();

            expect(OwnCloudServices.setArticleAsUnread).toHaveBeenCalled();
            expect(scope.articles[0].unread).toBe(true);
        });

        it('method toggleRead on read article should not do anything in case of API error', function(){
            $httpBackend.expectPUT().respond(404,[]);

            scope.articles[0].unread = false;
            spyOn(OwnCloudServices,'setArticleAsUnread').andCallThrough();
            scope.toggleRead(1);
            $httpBackend.flush();

            expect(OwnCloudServices.setArticleAsUnread).toHaveBeenCalled();
            expect(scope.articles[0].unread).toBe(false);
        });

        // select/unselect method testing

        it('method selectAll should select all articles', function(){
            scope.selectAll();
            expect(scope.articles).toHaveAllKeysWithValues('selected',true);
        });

        it('method selectAll should select all articles', function(){
            scope.unselectAll();
            expect(scope.articles).toHaveAllKeysWithValues('selected',false);
        });

        afterEach(function () {
            scope.articles = [];
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('when viewing STARRED articles', function(){

        beforeEach(function () {
            scope.lastArticleId = 0;
            scope.articles = [];

            $httpBackend.expectGET().respond(200, {items:[{id:1, starred:true, selected:true, unread:true}]});
            createController('star');
            $httpBackend.flush();
        });

        it('all articles should have starred value set to true', function(){
           expect(scope.articles).toHaveAllKeysWithValues('starred',true);
        });

        it('method getArticles should be called', function(){
            $httpBackend.expectGET().respond(200, {items:[
                {id:2, selected:false, starred: true}
            ]});

            spyOn(scope.map[scope.type], 'fun').andCallThrough();
            scope.getArticles();
            $httpBackend.flush();

            expect(scope.map[scope.type].fun).toHaveBeenCalled();

            //lastArticleId is not the one from this GET but the
            //one that was before this one, that is id from first
            //GET in beforeEach!!!
            expect(scope.map[scope.type].fun).toHaveBeenCalledWith($routeParams.id, 1);
        });

        afterEach(function(){
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('when viewing FEED articles', function(){

        beforeEach(function () {
            scope.lastArticleId = 0;
            scope.articles = [];

            $httpBackend.expectGET().respond(200, {items:[{id:1, feedId:0}]});
            createController('feed');
            $httpBackend.flush();
        });

        it('method getArticles should be called', function(){
            $httpBackend.expectGET().respond(200, {items:[
                {id:2, feedId:0}
            ]});

            spyOn(scope.map[scope.type], 'fun').andCallThrough();
            scope.getArticles();
            $httpBackend.flush();

            expect(scope.map[scope.type].fun).toHaveBeenCalled();

            //lastArticleId is not the one from this GET but the
            //one that was before this one, that is id from first
            //GET in beforeEach!!!
            expect(scope.map[scope.type].fun).toHaveBeenCalledWith($routeParams.id, 1);
        });

        afterEach(function(){
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('when viewing FOLDER articles', function(){

        beforeEach(function () {
            scope.lastArticleId = 0;
            scope.articles = [];

            $httpBackend.expectGET().respond(200, {items:[{id:1}]});
            createController('folder');
            $httpBackend.flush();
        });

        it('method getArticles should be called', function(){
            $httpBackend.expectGET().respond(200, {items:[{id:2}]});

            spyOn(scope.map[scope.type], 'fun').andCallThrough();
            scope.getArticles();
            $httpBackend.flush();

            expect(scope.map[scope.type].fun).toHaveBeenCalled();

            //lastArticleId is not the one from this GET but the
            //one that was before this one, that is id from first
            //GET in beforeEach!!!
            expect(scope.map[scope.type].fun).toHaveBeenCalledWith($routeParams.id, 1);
        });

        afterEach(function(){
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});