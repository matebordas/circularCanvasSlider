// SVG stuff
var range = document.querySelector('#range');



var sliderLine = document.querySelector('#sliderLine');
var baseLine = document.querySelector('#baseLine');

var sliderLineContext = sliderLine.getContext('2d');
var baseLineCtx = baseLine.getContext("2d");

var circ = Math.PI * 2;
var quart = Math.PI / 2;


var radius = 70;
var r = 120;
var slider = document.querySelector("#slider");
slider.style.width = 20 + 'px';
slider.style.height = 20 + 'px';
var sliderW2 = (slider.offsetWidth/2);
var sliderH2 = (slider.offsetHeight/2);
var sliderPosX = Math.round((radius)* Math.sin(0));
var sliderPosY = Math.round((radius)*  -Math.cos(0));
slider.style.left = (sliderPosX+r-sliderW2) + "px";
slider.style.top = (sliderPosY+r-sliderH2) + "px";

createContext(sliderLineContext, '#99CC33', 11.0);
createContext(baseLineCtx, 'red', 10.0);

var sliderLineImageData = sliderLineContext.getImageData(0, 0, 240, 240);
var baseLineImageData = baseLineCtx.getImageData(0, 0, 240, 240);

draw(baseLineCtx, baseLineImageData, 1.5*Math.PI);

range.onmousemove = function(e) {
    draw(sliderLineContext, sliderLineImageData, this.value / 100);
};

function createContext(context, color, lineWidth) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineCap = 'square';
    context.closePath();
    context.fill();
    context.lineWidth = lineWidth;
}

var deg = 0;
var mouseDown = false;

var elP = getOffsetRect(baseLine);
var elPos = { x: elP.left, y: elP.top};
var stepSize = 1;

/*baseLine.onmousedown = function(e){mouseDown = true};
baseLine.onmouseup = function(e){mouseDown = false};*/
//baseLine.onmousemove= function(e) {
sliderLine.onmousedown = function(e){mouseDown = true};
slider.onmousedown = function(e){mouseDown = true};
sliderLine.onmouseup = function(e){mouseDown = false};
sliderLine.onmousemove= function(e) {
    if (mouseDown === true) {
        //var mousePosition = {x: e.clientX-elPos.x, y: e.clientY-elPos.y};
        var mousePosition = {x: e.clientX-radius-elPos.x, y: e.clientY-radius-elPos.y};
      /*  if(mousePosition.y < 120 - 75) {
            return;
        }*/

        var atan = Math.atan2(mousePosition.x-radius, mousePosition.y-radius);
        deg = -atan/(Math.PI/180) + 180;
        var value = 0 + Math.round(deg/stepSize);

        sliderPosX = Math.round(radius* Math.sin((value * stepSize)*Math.PI/180));
        sliderPosY = Math.round(radius*  -Math.cos((value * stepSize)*Math.PI/180));

        slider.style.left = (sliderPosX+r-sliderW2) + "px";
        slider.style.top = (sliderPosY+r-sliderH2) + "px";

        draw2(value, stepSize);

        slider.style.webkitTransform = "rotate(" + deg + "deg)";
        slider.style.MozTransform = "rotate(" + deg + "deg)";

        // PRINT VALUES
        //document.getElementById('test').value = value * dataStep;
    }
};

function draw(context, imgData, currentValue) {
    context.putImageData(imgData, 0, 0);
    context.beginPath();
    context.arc(r, r, radius, -(quart), ((circ) * currentValue) - quart, false);
    context.stroke();
}

function draw2(current, step) {
    sliderLineContext.putImageData(sliderLineImageData, 0, 0);
    sliderLineContext.beginPath();

    var val = (current) * step;
    var rad = degreesToRadians(val);

    sliderLineContext.arc(r, r, radius, -(quart), rad, false);

    sliderLineContext.lineWidth = 15;
    sliderLineContext.strokeStyle = 'green';
    sliderLineContext.stroke();
}

function degreesToRadians (degrees) {
    return (degrees * Math.PI/180) - quart;
}

function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    // (2)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    // (3)
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    // (4)
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: top, left: left }
}