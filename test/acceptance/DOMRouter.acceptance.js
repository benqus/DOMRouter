module("DOMRouter Basic acceptance test");

window.onload = function ($s, $) {
    test("click acceptance", function () {
        var proto = DOMRouter.prototype;
        var invokedMethods = "normalizeEvent,addListener,callback".split(",");
        var notInvokedMethods = "removeListener,getElement,removeListeners,removeAllListeners,setElement".split(",");
        var context = { click: function () {} };
        var router = new DOMRouter(context, $("#router")[0]);
        var i;

        //spies
        $s.spy(context, "click");
        for (i = 0; i < invokedMethods.length; i++) {
            $s.spy(proto, invokedMethods[i]);
        }
        for (i = 0; i < notInvokedMethods.length; i++) {
            $s.spy(proto, notInvokedMethods[i]);
        }

        //adding listener
        router.addListener({"click": "click"});

        //adding listener test
        ok(router.listeners.hasOwnProperty("click"));
        equal(typeof router.listeners.click, "string");

        //event callback tests
        var $li = $("nav > ul > li:first");
        $li.trigger("click");

        var call = router.callback.getCall(0);
        var event = call.args[0];
        ok(event instanceof MouseEvent);
        equal(event.type, "click");
        equal(event.target, $li[0]);

        for (i = 0; i < invokedMethods.length; i++) {
            ok(router[invokedMethods[i]].calledOnce);
        }

        for (i = 0; i < notInvokedMethods.length; i++) {
            ok(router[notInvokedMethods[i]].notCalled);
        }

        //restore spies
        for (i = 0; i < invokedMethods.length; i++) {
            proto[invokedMethods[i]].restore();
        }
        for (i = 0; i < notInvokedMethods.length; i++) {
            proto[notInvokedMethods[i]].restore();
        }
    });
}.bind(window, sinon, jQuery);