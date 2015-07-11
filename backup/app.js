// SVG stuff
var range = document.querySelector('#range');
var counter = document.querySelector('#slider');
var baseLine = document.querySelector('#baseLine');

var counterCtx = counter.getContext('2d');
var baseLineCtx = baseLine.getContext("2d");

var circ = Math.PI * 2;
var quart = Math.PI / 2;

createContext(counterCtx, '#99CC33', 11.0);
createContext(baseLineCtx, 'red', 10.0);

var counterImageData = counterCtx.getImageData(0, 0, 240, 240);
var baseLineImageData = baseLineCtx.getImageData(0, 0, 240, 240);

draw(baseLineCtx, baseLineImageData, 1.5*Math.PI);

range.onmousemove = function(e) {
    draw(counterCtx, counterImageData, this.value / 100);
};

function draw(context, imgData, current) {
    context.putImageData(imgData, 0, 0);
    context.beginPath();
    context.arc(120, 120, 70, -(quart), ((circ) * current) - quart, false);
    context.stroke();
}

function createContext(context, color, lineWidth) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineCap = 'square';
    context.closePath();
    context.fill();
    context.lineWidth = lineWidth;
}