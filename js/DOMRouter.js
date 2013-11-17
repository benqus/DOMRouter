/**
 * Generic proxy object to catch or group DOMEvents together
 * @param context {Object} the context of the callback
 * @param [tag] {String|HTMLElement} either the tagname of the proxy element or a pre-specified element
 * @constructor DOMRouter
 */
var DOMRouter = function (context, tag) {
    this.context = context;
    this.element = (tag instanceof HTMLElement ? tag : document.createElement(tag || "div"));
    this.element.__router__ = this;
    this.listeners = {};
};

/**
 * prefix for browser specific generic event types
 * @static
 */
DOMRouter.eventPrefix = (typeof document.addEventListener === 'function' ? "" : "on");

/**
 * collection of the browser specific event types
 * @static
 */
DOMRouter.handlers = (function () {
    var isCoolBrowser = (DOMRouter.eventPrefix === 'on');
    
    return {
        add: (isCoolBrowser ? "addEventListener" : "attachEvent"),
        remove: (isCoolBrowser ? "removeEventListener" : "detachEvent"),
        dispatch: (isCoolBrowser ? "dispatchEvent" : "fireEvent")
    };
}());

DOMRouter.prototype = {
    constructor: DOMRouter,
    
    /**
     * generic event capture method. Each DOMRouter instance references and calls ONE function
     */
    listener: function () {
        var router = this.__router__;
        return router.callback.apply(router, arguments);
    },
        
    /**
     * resolves the event based on the actual browser
     * @param event {String}
     * @returns {String}
     */
    normalizeEvent: function (event) {
        return (DOMRouter.eventPrefix + event.replace("on", ""));
    },
    
    /**
     * adds event listener
     * @param listeners {Object} map of events as keys and callbacks as strings or functions
     * @return {DOMRouter}
     */
    addListener: function (listeners) {
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
    },
    
    /**
     * removes the listener from the lookup
     * @param listener
     * @return {DOMRouter}
     */
    removeListener: function (listener) {
        var element = this.element;
        delete this.listeners[listener];
        element[DOMRouter.handlers.remove](this.normalizeEvent(listener), this.listener);
        return this;
    },
    
    /**
     * removes all listeners from the dom element
     * @return {DOMRouter}
     */
    removeListeners: function () {
        var element = this.element;
        var listeners = this.listeners;
        var l;
    
        for (l in listeners) {
            if (listeners.hasOwnProperty(l)) {
                element[DOMRouter.handlers.remove](this.normalizeEvent(l), this.listener);
            }
        }
    
        return this;
    },
    
    /**
     * removes all listeners from the dom element and the hub too
     * @return {DOMRouter}
     */
    //TODO: rename to 'reset'
    removeAllListeners: function () {
        this.removeListeners();
        this.listeners = {};
        return this;
    },
    
    /**
     * replaces the router element
     * @param element {HTMLElement}
     * @param listeners {Object} map of events as keys and callbacks as strings or functions
     * @return {DOMRouter}
     */
    setElement: function (element, listeners) {
        var l;
        var _listeners = this.listeners;
    
        //unregister all events from old element
        this.removeListeners();
    
        this.element = element;
        this.element.__router__ = this;
    
        //register events again
        for (l in listeners) {
            if (listeners.hasOwnProperty(l) && !_listeners.hasOwnProperty(l)) {
                element[DOMRouter.handlers.add](this.normalizeEvent(l), this.listener);
    
                _listeners[l] = listeners[l];
            }
        }
    
        return this;
    },
    
    /**
     * generic callback for each event
     * @param event {Event}
     */
    callback: function (event) {
        var type = event.type;
        var context = this.context;
        var listeners = this.listeners;
        var listener;
    
        if (listeners.hasOwnProperty(type)) {
            listener = listeners[type];
    
            if (typeof listener === "string") {
                return context[listener].apply(context, arguments);
            } else if (typeof listener === "function") {
                return listener.apply(context, arguments);
            }
        }
    
        return true;
    }
};