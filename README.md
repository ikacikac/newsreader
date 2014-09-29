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

For now, application can be builded for Chrome, Android and FirefoxOS. Steps for building application for each of menitioned platforms will be given in following section. 

You should have node.js installed on your system. Also, you first have to clone this repository with:

`git clone https://github.com/ikacikac/newsreader.git newsreader`

After positioning yourself in this newly created directory you have to install all tools needed for building. Do that by running 

`npm install`

After installing tools you have to setup initial build folder structure by running

`grunt mkdir:init`

Now you have all things needed for building application which is described in steps below.

### Web application

Web application is builded by running 

`grunt web`

command, while in project directory.

After that you can run web server in `/build/web/` directory.

If you are using Linux you should have permission to run `python -m SimpleHTTPServer 9000`. After that open `http://localhost:9000/` in browser and voila, behold the amazing application!!

### Chrome application

Run `grunt chrome` and after that go to `/build` directory.

Run next command in console `chromium-browser --pack-extension=chrome/`. This will make a package and private key.
Go to file browser and drag file to Chrome's extensions tab.

Thats it!

### Android version

!WARNING! Before building Android version of this application you have to download Android SDK and add path to it's tools to system PATH. That way you will be able to access `android` or `adb` tools.

Run `grunt cordovacli` for initializing cordova folder structure.

After that go to `/build/cordova/`.

Run `grunt cordova` which will build version for cordova.

Then run `cordova build android` and `cordova run android`.

Before running last command, make sure that you have connected your device or that you have installed Android SDK and setup emulator.

### FirefoxOS version

Building package for FirefoxOS is easy as running next command.

`grunt firefoxos`

After that you should have `build/firefoxos` directory and `package.zip` in it. Load that archive in Firefox App Manager and application will be installed on your device/simulator.

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
