## DOMRouter

Event routing class

Wraps a collection of events into/around a router object.

Usage:

    var root = document.createElement("div");
    var app = {
        click: function () {
            // disco...
        }
    };

    var router = new DOMRouter(app, root);
    router.addListener({
        "click": app.click
    });
