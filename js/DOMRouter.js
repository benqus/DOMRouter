//Object.create shim
if (typeof Object.create === "undefined") {
    Object.create = function (proto) {
        var F = function () {};
        F.prototype = proto;
        return new F();
    };
}

//Date.now shim
if (typeof Date.now === "undefined") {
    Date.now = function () {
        return new Date().getTime();
    };
}

/**
 * Generic proxy object to catch or group DOMEvents together
 * @param context {Object} the context of the callback
 * @param [tag] {String|HTMLElement} either the tagname of the proxy element or a pre-specified element
 * @constructor DOMRouter
 */
var DOMRouter = function (context, tag) {
    var self = this;
    self.context = context;
    self.element = (tag instanceof HTMLElement ?
        tag : document.createElement(tag || "div"));
    self.listeners = {};
    self.listener = function () {
        self.callback.apply(self, arguments)
    };
};

/**
 * resolves the event based on the actual browser
 * @param event {String}
 * @returns {String}
 */
DOMRouter.prototype.normalizeEvent = function (event) {
    return (DOMRouter.eventPrefix + event.replace("on", ""));
};

/**
 * adds event listener
 * @param listeners {Object} map of events as keys and callbacks as strings or functions
 * @return {DOMRouter}
 */
DOMRouter.prototype.addListener = function (listeners) {
    var l;
    var element = this.element;
    var _listeners = this.listeners;

    for (l in listeners) {
        if (listeners.hasOwnProperty(l) && !_listeners.hasOwnProperty(l)) {
            element[DOMRouter.handlers.add](this.normalizeEvent(l), this.listener);

            _listeners[l] = listeners[l];
        }
    }

    return this;
};

/**
 * removes the listener from the lookup
 * @param listener
 * @return {DOMRouter}
 */
DOMRouter.prototype.removeListener = function (listener) {
    var element = this.element;
    delete this.listeners[listener];
    element[DOMRouter.handlers.remove](this.normalizeEvent(listener), this.listener);
    return this;
};

/**
 * removes all listeners from the dom element
 * @return {DOMRouter}
 */
DOMRouter.prototype.removeListeners = function () {
    var element = this.element;
    var listeners = this.listeners;
    var l;

    for (l in listeners) {
        if (listeners.hasOwnProperty(l)) {
            element[DOMRouter.handlers.remove](this.normalizeEvent(l), this.listener);
        }
    }

    return this;
};

/**
 * removes all listeners from the dom element and the hub too
 * @return {DOMRouter}
 */
DOMRouter.prototype.removeAllListeners = function () {
    this.removeListeners();
    this.listeners = {};
    return this;
};

/**
 * returns the proxy DOMElement
 * @returns {HTMLElement}
 */
DOMRouter.prototype.getElement = function () {
	return this.element;
};

/**
 * replaces the router element
 * @param element {HTMLElement}
 * @param listeners {Object} map of events as keys and callbacks as strings or functions
 * @return {DOMRouter}
 */
DOMRouter.prototype.setElement = function (element, listeners) {
    var l;
    var _listeners = this.listeners;

    //unregister all events from old element
    this.removeListeners();

    this.element = element;

    //register events again
    for (l in listeners) {
        if (listeners.hasOwnProperty(l) && !_listeners.hasOwnProperty(l)) {
            element[DOMRouter.handlers.add](this.normalizeEvent(l), this.listener);

            _listeners[l] = listeners[l];
        }
    }

    return this;
};

/**
 * generic callback for each event
 * @param event {Event}
 */
DOMRouter.prototype.callback = function (event) {
    var listeners = this.listeners;
    var type = event.type;
    var context = this.context;
    var listener;

    if (listeners.hasOwnProperty(type)) {
        listener = listeners[type];

        if (typeof listener === "string") {
            context[listener].apply(context, arguments);
        } else if (typeof listener === "function") {
            listener.apply(context, arguments);
        }
    }
};

/**
 * collection of the browser specific event types
 * @static
 */
DOMRouter.handlers = (function () {
    var events = {
        add: "addEventListener",
        remove: "removeEventListener",
        dispatch: "dispatchEvent"
    };

    //IE
    if (document.attachEvent) {
        events.add = "attachEvent";
        events.remove = "detachEvent";
        events.dispatch = "fireEvent";
    }

    return events;
}());

/**
 * prefix for browser specific generic event types
 * @static
 */
DOMRouter.eventPrefix = (function () {
    var div = document.createElement("div");
    return (div.addEventListener ? "" : "on");
}());

/**
 * @static
 * for debugging
 * @returns {Console}
 */
DOMRouter.getConsole = function () {
    return (console ? console : { log: function () {} });
};
