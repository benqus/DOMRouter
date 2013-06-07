
var app = Object.create({
    click: function () {
        var console = DOMRouter.getConsole();
        console.log("click", this, arguments);
    },
    mousedown: function () {
        var console = DOMRouter.getConsole();
        console.log("mousedown", this, arguments);

        this.hub.removeListener("mousedown");
    },
    render: function () {
        var element = this.hub.getElement();

        document.body.appendChild(element);

        element.style.width = "100%";
        element.style.height = "100%";
    }
});






var domEventHub = new DOMRouter(app);

domEventHub.addListener({
    "click": "click",
    "mousedown": app.mousedown
});

app.hub = domEventHub;
app.name = "App_" + Date.now();




window.onload = function () {
    app.render();
};
