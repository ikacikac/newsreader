{
    "manifest_version": "@echo VERSION",
    "name": "@echo NAME",
    "description": "@echo DESCRIPTION",
    "version": "@echo VERSION",
    "permissions": [
        "http://api.wunderground.com/api/",
        "http://autocomplete.wunderground.com/api"
    ],
    "background": {
        "scripts": ["js/vendor/angular.min.js"]
    },
    "content_security_policy": "default-src 'self'; object-src 'self'",
}