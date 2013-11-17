
var app = Object.create({
    click: function (e) {
        console.log("click", e);
    },
    mousedown: function (e) {
        console.log("mousedown", e);

        this.hub.removeListener("mousedown");
    },
    render: function () {
        var element = this.hub.getElement();
        document.body.appendChild(element);
    }
});






var div1 = document.createElement("div");

var div2 = document.createElement("div");
div2.setAttribute("class", "second");

var div3 = document.createElement("div");
div3.setAttribute("class", "third");

div2.appendChild(div3);
div1.appendChild(div2);

div1.setAttribute("class", "trigger first");

var domEventHub = new DOMRouter(app, div1);

domEventHub.addListener({
    "click": "click",
    "mousedown": app.mousedown
});

app.hub = domEventHub;
app.name = "App_" + Date.now();




window.onload = function () {
    app.render();
};
