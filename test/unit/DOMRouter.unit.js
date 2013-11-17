(function () {
    module("DOMRouter");

    test("static", function () {
        var prefix = DOMRouter.eventPrefix;
        var handlers = DOMRouter.handlers;

        ok(handlers instanceof Object);
        ok(typeof handlers.add, "string");
        ok(typeof handlers.remove, "string");
        ok(typeof handlers.dispatch, "string");

        ok(typeof prefix, "string");
        ok(prefix === "on" || prefix === "");
    });

    test("prototype", function () {
        var proto = DOMRouter.prototype;
        var methods = "normalizeEvent,addListener,removeListener,removeListeners,removeAllListeners,listener,getElement,setElement,callback".split(",");

        while (methods.length > 0) {
            ok(proto.hasOwnProperty(methods.shift()));
        }
    });

    test("instance", function () {
        var properties = "context,listeners,element".split(",");

        var context = { timestamp: "TEST_" + Date.now() };
        var router = new DOMRouter(context);
        var property;

        while (properties.length > 0) {
            property = properties.shift();
            ok(router.hasOwnProperty(property));
            notEqual(typeof router[property], "undefined");
        }

        equal(router.context, context);
        equal(typeof router.listener, "function");
        deepEqual(router.listeners, {});
        ok(router.element instanceof HTMLElement);
    });
}());