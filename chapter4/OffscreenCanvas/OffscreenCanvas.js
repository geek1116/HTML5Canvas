const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    image = new Image(),
    scaleOutput = document.querySelector('#scaleOutput'),
    scaleSlider = document.querySelector('#scaleSlider'),
    offscreenCanvas = document.createElement('canvas'),
    offscreenContext = offscreenCanvas.getContext('2d');
let scale = 1.0;

function drawScaled() {
    console.log(scale);
    let w = canvas.width,
        h = canvas.height,
        sw = w * scale,
        sh = h * scale;
    context.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height,
                            -sw / 2 + w / 2, -sh / 2 + h / 2, sw, sh);
}

function drawScaleText(value) {
    let text = parseFloat(value).toFixed(1);
    scaleOutput.innerText = text;
}

function drawWaterMarker(context) {
    let lineOne = 'Copyright',
    lineTwo = 'Acme, Inc.',
    textMetrics = null,
    FONT_HEIGHT = 128;

    context.save();
    context.fillStyle = 'rgba(100, 140, 230, 0.5)';
    context.strokeStyle = 'yellow';
    context.shadowColor = 'rgba(50, 50, 50, 1.0)';
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.shadowBlur = 10;

    context.translate(canvas.width / 2, canvas.height / 2);
    context.font = FONT_HEIGHT + 'px Arial';
    textMetrics = context.measureText(lineOne);
    context.fillText(lineOne, -textMetrics.width / 2, 0);
    context.strokeText(lineOne, -textMetrics.width / 2, 0);

    textMetrics = context.measureText(lineTwo);
    context.fillText(lineTwo, -textMetrics.width / 2, FONT_HEIGHT);
    context.strokeText(lineTwo, -textMetrics.width / 2, FONT_HEIGHT);

    context.restore();
}

scaleSlider.onchange = (e) => {
    scale = e.target.value;
    drawScaled();
    drawScaleText(scale);
}

image.src = './bg.jpg';
image.onload = () => {
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    offscreenContext.drawImage(image, 0, 0, canvas.width, canvas.height);

    drawWaterMarker(context);
    drawWaterMarker(offscreenContext);
    drawScaleText(scaleSlider.value);
}