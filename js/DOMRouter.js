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
 * @param [tagName] {String} the tagname of the proxy element
 * @constructor
 */
var DOMRouter = function (context, tagName) {
    var self = this;
    self.context = context;
    self.element = document.createElement(tagName || "div");
    self.listeners = {};
    self.listener = function () {
        self.callback.apply(self, arguments)
    };
};

/**
 * for debugging
 * @returns {Console}
 */
DOMRouter.getConsole = function () {
    var c = console;

    if (typeof console === "undefined") {
        c = {
            log: function () {}
        };
    } else {
        c = console;
    }

    return c;
};

/**
 * resolves the event based on the actual browser
 * @param event {String}
 * @returns {String}
 * @private
 */
DOMRouter.prototype._getEvent = function (event) {
    return (DOMRouter.eventPrefix + event.replace("on", ""));
};

/**
 * adds event listener
 * @param listeners {Object} map of events as keys and callbacks as strings or functions
 * @return {DOMRouter}
 */
DOMRouter.prototype.addListener = function (listeners) {
    var l;
    var element = this.getElement();
    var _listeners = this.listeners;

    for (l in listeners) {
        if (listeners.hasOwnProperty(l) && !_listeners.hasOwnProperty(l)) {
            element[DOMRouter.handlers.add](this._getEvent(l), this.listener);

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
    var element = this.getElement();

    delete this.listeners[listener];
    element[DOMRouter.handlers.remove](this._getEvent(listener), this.listener);
    return this;
};

/**
 * replaces the current listener in the lookup
 * @param listeners {Object} map of events as keys and callbacks as strings or functions
 * @return {DOMRouter}
 */
DOMRouter.prototype.replaceListener = function (listeners) {
    var l;
    var element = this.getElement();
    var _listeners = this.listeners;

    for (l in listeners) {
        if (listeners.hasOwnProperty(l)) {
            element[DOMRouter.handlers.add](this._getEvent(l), this.listener);

            _listeners[l] = listeners[l];
        }
    }

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
 * @static
 */
DOMRouter.eventPrefix = (function () {
    var div = document.createElement("div");
    return (div.addEventListener ? "" : "on");
}());
