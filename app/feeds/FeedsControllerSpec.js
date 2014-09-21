/*
 * The MIT License (MIT)
 *
 * Copyright (c) 9/16/14 Ilija Lazarevic
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

describe('Feeds Controller unit test:', function () {

    beforeEach(module('newsreader'));

    var scope, getController, OwnCloudServices, $httpBackend;

    beforeEach(inject(function ($rootScope, $controller, _$httpBackend_, _OwnCloudServices_) {
        scope = $rootScope.$new();
        OwnCloudServices = _OwnCloudServices_;
        $httpBackend = _$httpBackend_;


        getController = function(){
            return $controller('FeedsCtrl', {$scope:scope});
        };

    }));

    it('feeds array should be empty', function () {
        $httpBackend.expectGET().respond(200, {feeds:[]});

        var c = getController();
        $httpBackend.flush();

        expect(scope.feeds.length).toBe(0);
    });

    it('feeds array should have data', function () {
        $httpBackend.expectGET().respond(200, {feeds:['data']});

        var c = getController();
        $httpBackend.flush();

        expect(scope.feeds.length).toBe(1);
    });

    it('getFeeds method should have been called', function () {
        $httpBackend.expectGET().respond(200, {feeds:[]});

        spyOn(OwnCloudServices, 'getFeeds').andCallThrough();

        var c = getController();
        $httpBackend.flush();

        expect(OwnCloudServices.getFeeds).toHaveBeenCalled();
    });

    afterEach(function () {
        scope.feeds = [];
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});
