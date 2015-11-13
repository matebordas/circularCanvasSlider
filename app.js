(function() {

    var currentDegree = 0;
    var mouseDown = false;

    var circle = Math.PI * 2;
    var quarter = Math.PI / 2;

//get Elements
    var valueLabel = document.querySelector('#valueLabel');
    var sliderLine = document.querySelector('.sliderLine');
    var containerId = sliderLine.dataset.containerid;
    var container = document.querySelector('#' + containerId);

//add elements
    var slider = createElementWithClassName('div', 'slider');
    var baseLine = createElementWithClassName('canvas', 'baseLine');

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

//Cavas lines style
    var circleRadius = Number(sliderLine.dataset.radius);
    var additionalSpace = 10;
    var canvasSize = (circleRadius * 2) + additionalSpace;
    baseLine.width = canvasSize;
    baseLine.height = canvasSize;

    sliderLine.width = canvasSize;
    sliderLine.height = canvasSize;

    container.style.width = canvasSize + 'px';
    container.style.height = canvasSize + 'px';

    valueLabel.style.marginTop = canvasSize / 2 + 'px';
    valueLabel.style.marginLeft = canvasSize / 2 + 'px';

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

    var sliderLineImageData = sliderLineContext.getImageData(0, 0, canvasSize, canvasSize);
    var baseLineImageData = baseLineCtx.getImageData(0, 0, canvasSize, canvasSize);

    drawCircle(baseLineCtx, baseLineImageData, 1.5 * Math.PI);

    var baselineOffset = sliderLine.getBoundingClientRect();
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
            var mousePosition = {x: e.clientX-baselinePos.x, y: e.clientY-baselinePos.y};

            if (pointOusideCircle(mousePosition, circleRadius, circleRadius, circleRadius)) {
                mouseDown = false;
            }

            if (pointInsideCircleOffTheLine(mousePosition, circleRadius, circleRadius, circleRadius)) {
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
           valueLabel.innerHTML = value * stepSize;
        }
    };

    function createElementWithClassName(element, className) {
        var newElement = document.createElement(element);
        newElement.className  = className;
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
        sliderLineContext.clearRect(0, 0, canvasSize, canvasSize);
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

    /*
    * x = mouse X position
    * y = mouse Y position
    * cx = circle X center
    * cy = circle Y center
    * */
    function pointOusideCircle(mousePosition, cx, cy, radius) {
        var x = mousePosition.x;
        var y = mousePosition.y;
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared > (radius + (additionalSpace * 3)) * (radius + (additionalSpace * 3));
    }

    function pointInsideCircleOffTheLine(mousePosition, cx, cy, radius) {
        var x = mousePosition.x;
        var y = mousePosition.y;
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared < (radius - (additionalSpace * 3)) * (radius - (additionalSpace * 3));
    }

})();