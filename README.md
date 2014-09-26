# News reader (now only for OwnCloud)

## Idea

Idea behind making this project is to try and make application for Chrome, Android and FirefoxOS. My first try was project [news-reader](https://github.com/owncloud/news-mobile). While that application was intended to be used on FirefoxOS and Android, it lacks some better understanding of AngularJS concepts and was made as my first contact with modern frontend development.

This project, while at first developed for OwnCloud News feeds, is not intended to remain just for OwnCloud. Also, building Chrome extension from it is primary goal. Versions for FirefoxOs and Android will also be included in future.

At the and this project was made while improving AngularJS knowledge, and is by no mean best example. That is why I'd like anyone who feels free to contribute. Thank you!

## Stack

Libraries used for project are:
 - AngularJS 1.2.23 (and couple of modules not included in main one) as application framework,
 - Bootstrap 3.2 for UX, 
 - Angular Bind Once for reducing the number of $watched variable which are never changed,
 - Angular Local Storage for accessing browser's local storage

Tools used for project are:
 - Yeoman tools for building and working with project,
 - Karma and Jasmine for unit testing,
 - Cordova 3.6.3 for building Android and FirefoxOS version.

## Build application

For now, application can be builded for Chrome, Android and FirefoxOS. Steps for building application for each of menitioned platforms will be given in following section. Of course, there is the simplest thing and that is web application.

Directory which is used for building is not part of repository. Because of that you have to run `grunt mkdir:init` for initial folder structure where builds will be located.

### Web application

After making initial folder structure for builds, you have to run `grunt web`. Grunt will do concatenation, minificiation, wrapping and copying files. After that you can run web server in `/build/web/` directory.

If you are using Linux you should have permission to run `python -m SimpleHTTPServer 9000`. After that open `http://localhost:9000/` in browser and voila, behold the amazing application!!

### Chrome application

Run `grunt chrome` and after that go to `/build/chrome` directory.
Run next command in console `chromium-browser --pack-extension=chrome/`. This will make a package and private key.
Go to file browser and drag file to Chrome's extensions tab.
Thats it!

### Android version

Run `grunt cordovacli` for initializing cordova folder structure.
After that go to `/build/cordova/`.
Run `grunt cordova` which will build version for cordova.
Then run `cordova build android` and `cordova run android`.

Before running last command, make sure that you have connected your device or that you have installed Android SDK and setup emulator.

## Images licencing

Images in */images* folder are part of [Linecons Free – Vector Icons Pack](https://www.iconfinder.com/iconsets/linecons-free-vector-icons-pack) by [designmodo](https://www.iconfinder.com/designmodo) and are licenced by [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/)

## LICENCE

The MIT License (MIT)

Copyright (c) 2014 Ilija Lazarevic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
