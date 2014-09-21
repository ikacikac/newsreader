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

describe('Login Controller unit test:', function () {

    beforeEach(module('newsreader'));

    var scope, $location, $httpBackend, OwnCloudServices, UserSettings;

    beforeEach(inject(function ($rootScope, $controller, _$location_, _$httpBackend_, _OwnCloudServices_, _UserSettings_) {
        scope = $rootScope.$new();
        $location = _$location_;
        $httpBackend = _$httpBackend_;
        UserSettings = _UserSettings_;
        OwnCloudServices = _OwnCloudServices_;

        UserSettings.userName = 'test';
        UserSettings.password = 'test';
        UserSettings.hostName = 'test';

        $controller('LoginCtrl', {$scope:scope});
    }));

    it('scope variables should have initial values', function(){
        expect(scope.showAlert).toBe(false);
        expect(scope.alertMessage).toBe('');

        expect(scope.userName).toBe('test');
        expect(scope.password).toBe('test');
        expect(scope.hostName).toBe('test');
    });

    describe('login method should',function(){

        it('have been called', function(){
            $httpBackend.expectGET().respond(200, {version:'1.0'});
            spyOn(OwnCloudServices,'login').andCallThrough();

            scope.login();
            $httpBackend.flush();

            expect(OwnCloudServices.login).toHaveBeenCalled();
        });

        it('set UserSettings parameters', function(){
            $httpBackend.expectGET().respond(200, {version:'1.0'});
            scope.userName = 'test1';
            scope.password = 'test1';
            scope.hostName = 'test1';

            scope.login();
            $httpBackend.flush();

            expect(UserSettings.userName).toBe('test1');
            expect(UserSettings.password).toBe('test1');
            expect(UserSettings.hostName).toBe('test1');
        });

        it('change loggedIn state and location path upon successful login', function(){
            $httpBackend.expectGET().respond(200, {version:'1.0'});

            scope.login();
            $httpBackend.flush();

            expect(UserSettings.loggedIn).toBe(true);
            expect($location.path()).toBe('/articles/all');
        });

        it('not change loggedIn state and location path upon unsuccessful login', function(){
            $httpBackend.expectGET().respond(404, {});

            scope.login();
            $httpBackend.flush();

            expect(UserSettings.loggedIn).toBe(false);
            expect($location.path()).toBe('');
        });

        it('not change alertMessage and showAlert scope variables upon successful login', function(){
            $httpBackend.expectGET().respond(200, {version:'1.0'});

            scope.login();
            $httpBackend.flush();

            expect(scope.showAlert).toBe(false);
            expect(scope.alertMessage.length).toBe(0);
        });

        it('change alertMessage and showAlert scope variables upon unsuccessful login', function(){
            $httpBackend.expectGET().respond(404, {});

            scope.login();
            $httpBackend.flush();

            expect(scope.showAlert).toBe(true);
            expect(scope.alertMessage.length).toBeGreaterThan(0);

        });
    });

    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});