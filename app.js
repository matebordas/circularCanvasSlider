(function() {

    var currentDegree = 0;
    var mouseDown = false;

    var circle = Math.PI * 2;
    var quarter = Math.PI / 2;

//get Elements
    var sliderLine = document.querySelector('#sliderLine');
    var containerId = sliderLine.dataset.containerid;
    var container = document.querySelector('#' + containerId);

//add elements
    var slider = createElementWithId('div', 'slider');

    var baseLine = createElementWithId('canvas', 'baseLine');
    baseLine.width = 240;
    baseLine.height = 240;

    container.appendChild(sliderLine);
    container.appendChild(slider);
    container.appendChild(baseLine);

    var sliderLineContext = sliderLine.getContext('2d');
    var baseLineCtx = baseLine.getContext("2d");

//Calculate steps and range
    var maxValue = Number(sliderLine.dataset.max);
    var minValue = Number(sliderLine.dataset.min);
    var range = maxValue - minValue;

    var stepSize = Number(sliderLine.dataset.step);
    var numberOfSteps = range / stepSize;
    var stepSizeDegree = 360 / numberOfSteps;

//Slider Line style
//TODO
    var circleRadius = Number(sliderLine.dataset.radius);
    var canvasSize = 240;
    sliderLine.width = canvasSize;
    sliderLine.height = canvasSize;

//Slider position and style
    slider.style.width = 20 + 'px';
    slider.style.height = 20 + 'px';
    var sliderW2 = (slider.offsetWidth / 2);
    var sliderH2 = (slider.offsetHeight / 2);
    var sliderPosX = Math.round((circleRadius) * Math.sin(0));
    var sliderPosY = Math.round((circleRadius) * -Math.cos(0));

    setElementPosition(slider, sliderPosX + (canvasSize / 2) - sliderW2, sliderPosY + (canvasSize / 2) - sliderH2);

    createContext(sliderLineContext, sliderLine.dataset.color, 11.0);
    createContext(baseLineCtx, 'red', 10.0);

    var sliderLineImageData = sliderLineContext.getImageData(0, 0, 240, 240);
    var baseLineImageData = baseLineCtx.getImageData(0, 0, 240, 240);

    drawCircle(baseLineCtx, baseLineImageData, 1.5 * Math.PI);

    var baselineOffset = getOffsetRect(sliderLine);
    var baselinePos = {x: baselineOffset.left, y: baselineOffset.top};

    slider.onmousedown = function (e) {
        mouseDown = true
    };
    slider.onmouseup = function (e) {
        mouseDown = false
    };

    sliderLine.onmousedown = function (e) {
        mouseDown = true
    };
    sliderLine.onmouseup = function (e) {
        mouseDown = false
    };

    sliderLine.onmousemove = function (e) {


        if (mouseDown === true) {
            var mousePosition = {
                x: e.clientX - circleRadius - baselinePos.x + parseInt(slider.style.width),
                y: e.clientY - circleRadius - baselinePos.y + parseInt(slider.style.height)
            };

            if (pointOusideCircle(mousePosition.x, mousePosition.y, circleRadius, circleRadius, circleRadius)) {
                mouseDown = false;
            }

            if (pointInsideCircleOffTheLine(mousePosition.x, mousePosition.y, circleRadius, circleRadius, circleRadius)) {
                mouseDown = false;
            }

            var atan = Math.atan2(mousePosition.x - circleRadius, mousePosition.y - circleRadius);
            currentDegree = -atan / (Math.PI / 180) + 180;
            var value = 0 + Math.round(currentDegree / stepSizeDegree);

            sliderPosX = Math.round(circleRadius * Math.sin((value * stepSizeDegree) * Math.PI / 180));
            sliderPosY = Math.round(circleRadius * -Math.cos((value * stepSizeDegree) * Math.PI / 180));

            setElementPosition(slider, sliderPosX + (canvasSize / 2) - sliderW2, sliderPosY + (canvasSize / 2) - sliderH2);
            drawCircleLine(value, stepSizeDegree);

            //rotate slider
            slider.style.webkitTransform = "rotate(" + currentDegree + "deg)";
            slider.style.MozTransform = "rotate(" + currentDegree + "deg)";

            // PRINT VALUES
            document.getElementById('sliderValue1').value = value * stepSize;
        }
    };

    function createElementWithId(element, id) {
        var newElement = document.createElement(element);
        newElement.id = id;
        return newElement;
    }

    function createContext(context, color, lineWidth) {
        context.beginPath();
        context.strokeStyle = color;
        context.lineCap = 'square';
        context.closePath();
        context.fill();
        context.lineWidth = lineWidth;
    }

    function setElementPosition(element, x, y) {
        element.style.left = x + "px";
        element.style.top = y + "px";
    }

    function drawCircle(context, imgData, currentValue) {
        context.putImageData(imgData, 0, 0);
        context.beginPath();
        context.arc((canvasSize / 2), (canvasSize / 2), circleRadius, -(quarter), ((circle) * currentValue) - quarter, false);
        context.stroke();
    }

    function drawCircleLine(current, step) {
        sliderLineContext.putImageData(sliderLineImageData, 0, 0);
        sliderLineContext.beginPath();

        var val = (current) * step;
        var rad = degreesToRadians(val);
        sliderLineContext.arc((canvasSize / 2), (canvasSize / 2), circleRadius, -(quarter), rad, false);
        sliderLineContext.stroke();
    }

    function degreesToRadians(degrees) {
        return (degrees * Math.PI / 180) - quarter;
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
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return {top: top, left: left}
    }

    function pointOusideCircle(x, y, cx, cy, radius) {
        var lineWidth = baseLineCtx.lineWidth; //just to make the scrolling smoother
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared > (radius + lineWidth) * (radius + lineWidth);
    }

    function pointInsideCircleOffTheLine(x, y, cx, cy, radius) {
        var lineWidth = baseLineCtx.lineWidth; //just to make the scrolling smoother
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared < (radius - lineWidth) * (radius - lineWidth);
    }

})();