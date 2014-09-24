{
    "manifest_version": 2,
    "name": "/* @echo NAME */",
    "description": "/* @echo DESCRIPTION*/",
    "version": "/* @echo VERSION*/",
    "app": {
        "background": {
            "persistent": false,
            "scripts": ["background.js"]
        }
    },
    "permissions":  [
        "<all_urls>",
        "storage"
    ],
    "icons": {
        "32":"images/document.png",
        "64":"images/document.png",
        "128":"images/document.png"
    }
}