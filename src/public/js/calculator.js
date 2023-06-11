document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("canvasContainer");
    const canvas = document.getElementById("gridCanvas");
    const context = canvas.getContext("2d");

    let zoomLevel = 1;
    const minZoom = 0.5;
    const maxZoom = 2;
    const zoomStep = 0.1;

    let panX = 0;
    let panY = 0;

    function drawGrid() {
        // Calculate the canvas size based on the container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Calculate the grid properties based on the zoom level
        const gridSize = Math.max(containerWidth, containerHeight);
        const cellSize = 20 * zoomLevel;

        // Calculate the visible area of the grid
        const visibleArea = {
            left: -panX / (cellSize * zoomLevel),
            top: -panY / (cellSize * zoomLevel),
            right: (-panX + containerWidth) / (cellSize * zoomLevel),
            bottom: (-panY + containerHeight) / (cellSize * zoomLevel)
        };

        // Clear the canvas
        context.clearRect(0, 0, containerWidth, containerHeight);

        // Draw the grid lines
        context.strokeStyle = "#ccc";
        context.lineWidth = 1;

        for (let x = Math.floor(visibleArea.left) * cellSize; x <= Math.ceil(visibleArea.right) * cellSize; x += cellSize) {
            context.beginPath();
            context.moveTo(x * zoomLevel + panX, 0);
            context.lineTo(x * zoomLevel + panX, containerHeight);
            context.stroke();
        }

        for (let y = Math.floor(visibleArea.top) * cellSize; y <= Math.ceil(visibleArea.bottom) * cellSize; y += cellSize) {
            context.beginPath();
            context.moveTo(0, y * zoomLevel + panY);
            context.lineTo(containerWidth, y * zoomLevel + panY);
            context.stroke();
        }
    }

    // Handle zooming with the mouse wheel
    container.addEventListener("wheel", function (event) {
        event.preventDefault();

        const zoomDirection = Math.sign(event.deltaY);
        let newZoomLevel = zoomLevel - zoomStep * zoomDirection;

        // Clamp the zoom level within the min and max values
        newZoomLevel = Math.max(minZoom, Math.min(maxZoom, newZoomLevel));

        // Calculate the position of the mouse pointer within the container
        const containerRect = container.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;

        // Calculate the old and new scroll positions
        const oldScrollX = container.scrollLeft;
        const oldScrollY = container.scrollTop;
        const newScrollX = (mouseX + oldScrollX) * (newZoomLevel / zoomLevel) - mouseX;
        const newScrollY = (mouseY + oldScrollY) * (newZoomLevel / zoomLevel) - mouseY;

        // Update the zoom level
        zoomLevel = newZoomLevel;

        // Redraw the grid
        render();

        // Adjust the scroll position to maintain the zoom point
        container.scrollLeft = newScrollX;
        container.scrollTop = newScrollY;
    });

    // Handle panning with the mouse drag
    let isPanning = false;
    let startX, startY, startPanX, startPanY;

    container.addEventListener("mousedown", function (event) {
        isPanning = true;
        startX = event.clientX;
        startY = event.clientY;
        startPanX = panX;
        startPanY = panY;
    });

    document.addEventListener("mousemove", function (event) {
        if (!isPanning) return;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        panX = startPanX + deltaX;
        panY = startPanY + deltaY;

        render();
    });

    document.addEventListener("mouseup", function () {
        isPanning = false;
    });

    // Draw the grid and square
    function render() {
        drawGrid();

        // Draw a square on top of the grid
        const squareSize = 100;
        const squareX = 200;
        const squareY = 200;
        const squareZoomSize = squareSize * zoomLevel;

        // Adjust the square position based on panning
        const adjustedSquareX = (squareX + panX) * zoomLevel;
        const adjustedSquareY = (squareY + panY) * zoomLevel;

        // Draw the square
        context.fillStyle = "red";
        context.fillRect(adjustedSquareX, adjustedSquareY, squareZoomSize, squareZoomSize);
    }

    render();
});
