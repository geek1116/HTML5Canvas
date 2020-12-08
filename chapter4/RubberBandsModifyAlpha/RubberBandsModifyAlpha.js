const canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        resetBtn = document.querySelector('#resetBtn');
let image = new Image(),
    imageData,
    imageDataCopy = context.createImageData(canvas.width, canvas.height),
    mousedown = {},
    rubberbandRectangle = {},
    dragging = false;

function windowToCanvas(x, y) {
    let canvasRectangle = canvas.getBoundingClientRect();
    return {
        x: x - canvasRectangle.left,
        y: y - canvasRectangle.top
    }
}

function copyCanvasPixels() {
    imageData.data.forEach((t, index) => {
        imageDataCopy.data[index] = index % 4 === 3 ? t / 2 : t;
    });
}

function captureCanvasPixels() {
    imageData = context.getImageData(0, 0, canvas.widht, canvas.height);
    copyCanvasPixels();
}

function rubberbandStart(x, y) {
    rubberbandRectangle.left = mousedown.x = x;
    rubberbandRectangle.top = mousedown.y = y;
    rubberbandRectangle.width = rubberbandRectangle.height = 0;

    dragging = true;
    captureCanvasPixels();
}

function resotreRubberbandPixels() {
    let deviceWidthOverCSSPixels = imageData.width / canvas.width, deviceHeightOverCSSPixels = imageData.height / canvas.height;

    context.putImage(imageData, 0, 0);
    context.putImage(imageDataCopy, 0, 0,
                        rubberbandRectangle.left + context.lineWidth,
                        rubberbandRectangle.top + context.lineWidth,
                        (rubberbandRectangle.width - 2 * context.lineWidth) * deviceWidthOverCSSPixels,
                        (rubberbandRectangle.height - 2 * context.lineWidth) * deviceHeightOverCSSPixels);
}

function setRubberbandRectangle(x, y) {
    rubberbandRectangle.left = loc.x < mousedown.x ? loc.x : mousedown.x;
    rubberbandRectangle.top = loc.y < mousedown.y ? loc.y : mousedown.y;

    rubberbandRectangle.width = Math.abs(loc.x - mousedown.x);
    rubberbandRectangle.height = Math.abs(loc.y - mousedown.y);
}

function drawRubberband() {
    context.strokeRect(rubberbandRectangle.left + context.lineWidth,
        rubberbandRectangle.top + context.lineWidth,
        rubberbandRectangle.width - 2 * context.lineWidth,
        rubberbandRectangle.height - 2 * context.lineWidth);
}

function rubberbandStretch(x, y) {
    setRubberbandRectangle(x, y);

    if(rubberbandRectangle.width > 2 * context.lineWidth &&
        rubberbandRectangle.height > 2 * context.lineWidth) {
        if(imageData !== undefined) {
            resotreRubberbandPixels();
        }

        drawRubberband();
    }
}

// ------------------------- Event Handlers ---------------------------
canvas.addEventListener('mousedown', (e) => {
    let loc = windowToCanvas(e.clientX, e.clientY);
    e.preventDefault();
    rubberbandStart(loc.x, loc.y);
})

canvas.addEventListener('mouseup', (e) => {
    if(dragging) {
        let loc = windowToCanvas(e.clientX, e.clientY);
        rubberbandStretch(loc.x, loc.y);
    }
})