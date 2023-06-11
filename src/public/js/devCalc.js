document.addEventListener("DOMContentLoaded", function () {
    // Here's how to evaluate math expressions using Math.js:
    var math = mathjs(),
        expr = 'sin(x)*x',
        scope = {
            x: 0,
            t: 0,
        },
        tree = math.parse(expr, scope);

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    var n = 100; // amount of lines
    var xMin = -20;
    var xMax = 20;
    var yMin = -20;
    var yMax = 20;

    var time = 0;
    var timeIncrement = 0.05;

    function drawCurve() {
        var x, y;
        var percentX, percentY;
        var xPixel, yPixel;
        var mathX, mathY;

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        for (let i = 0; i < n; i++) {
            percentX = i / (n - 1);
            mathX = percentX * (xMax - xMin) + xMin;

            mathY = evaluateMathExpr(mathX);

            percentY = (mathY - yMin) / (yMax - yMin);

            // Flip to match canvas coordinates.
            percentY = 1 - percentY;

            xPixel = percentX * canvas.width;
            yPixel = percentY * canvas.height;
            context.lineTo(xPixel, yPixel);
        }
        context.stroke();
    };

    function evaluateMathExpr(mathX) {
        scope.x = mathX;
        scope.t = time;
        return tree.eval();
    }

    // main program
    drawCurve();
    initTextField();
    startAnimation();

    function initTextField() {
        var input = document.getElementById("canvas-input");

        // Set the initial text value programmatically using jQuery.
        input.value = expr;

        // Listen for changes using jQuery.
        input.addEventListener("input", function (event) {
            expr = input.value;
            console.log(expr);
            console.log(scope);
            tree = math.parse(expr, scope);
            drawCurve();
        });
    }

    function startAnimation() {
        (function animloop() {
            requestAnimationFrame(animloop);
            render();
        }());
    }

    function render() {
        // increase time
        time += timeIncrement;

        // render
        drawCurve();
    }
});