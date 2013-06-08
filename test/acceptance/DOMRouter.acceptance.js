(function ($s, $) {
    module("DOMRouter - behaviour");

    test("acceptance", function () {
        var proto = DOMRouter.prototype;
        var methods = "normalizeEvent,addListener,removeListener,removeListeners,removeAllListeners,getElement,setElement,callback".split(",");
        var context = {
            click: function () {},
            mousedown: function () {}
        };
        var router = new DOMRouter(context);
        var i = 0;

        //spies
        $s.spy(context, "click");
        $s.spy(context, "mousedown");

        for (; i < methods.length; i++) {
            $s.spy(proto, methods[i]);
        }

        router.addListener({
            "click": "click",
            "mousedown": context.mousedown
        });

        //restore spies
        for (i = 0; i < methods.length; i++) {
            proto[methods[i]].restore();
        }
    });
}(sinon, jQuery));