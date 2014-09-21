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

describe('Folders Controller unit test:', function () {

    beforeEach(module('newsreader'));

    var scope, $httpBackend, $controller, OwnCloudServices, getController;

    beforeEach(inject(function ($rootScope, _$controller_, _$httpBackend_, _OwnCloudServices_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $controller = _$controller_;
        OwnCloudServices = _OwnCloudServices_;

        getController = function () {
            return $controller('FoldersCtrl', {$scope:scope});
        };
    }));

    it('folders array should be empty', function () {
        $httpBackend.expectGET().respond(200, {folders:[]});

        var c = getController();
        $httpBackend.flush();

        expect(scope.folders.length).toBe(0);
    });

    it('feeds array should have data', function () {
        $httpBackend.expectGET().respond(200, {folders:['data']});

        var c = getController();
        $httpBackend.flush();

        expect(scope.folders.length).toBe(1);
    });

    it('getFolders method should have been called', function () {
        $httpBackend.expectGET().respond(200, {folders:[]});

        spyOn(OwnCloudServices, 'getFolders').andCallThrough();

        var c = getController();
        $httpBackend.flush();

        expect(OwnCloudServices.getFolders).toHaveBeenCalled();
    });

    afterEach(function () {
        scope.folders = [];
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});