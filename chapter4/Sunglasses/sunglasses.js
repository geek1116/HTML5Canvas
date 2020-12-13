const image = new Image(),
        canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        offscreenCanvas = document.createElement('canvas'),
        offscreenContext = offscreenCanvas.getContext('2d'),
        sunglassBtn = document.querySelector('#shiftBtn');

        offscreenCanvas.width = canvas.width, offscreenCanvas.height = canvas.height;

let sunglassesOn = false,
    sunglassFilter = new Worker('sunglassFilter.js'),
    LENS_RADIUS = canvas.width / 5;

// ---------------------------------------------------------------

function putSunglassesOn() {
    let center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    leftLensLocation = {
        x: center.x - LENS_RADIUS - 10,
        y: center.y
    },
    rightLensLocation = {
        x: center.x + LENS_RADIUS + 10,
        y: center.y
    },
    imagedata = context.getImageData(0, 0, canvas.width, canvas.height);

    sunglassFilter.postMessage(imagedata);
    sunglassFilter.addEventListener('message', (event) => {
        offscreenContext.putImageData(event.data, 0, 0);
        drawLenses(leftLensLocation, rightLensLocation);
    })
}

function drawLenses(leftLensLocation, rightLensLocation) {
    context.save();
    context.beginPath();
    
    context.arc(leftLensLocation.x, leftLensLocation.y, LENS_RADIUS, 0, 2 * Math.PI, false);
    context.stroke();

    context.moveTo(rightLensLocation.x, rightLensLocation.y);

    context.arc(rightLensLocation.x, rightLensLocation.y, LENS_RADIUS, 0, 2 * Math.PI, false);
    context.stroke();

    context.clip();
    context.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);

    context.restore();
}

function drawOriginalImage() {
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
}

sunglassBtn.addEventListener('click', () => {
    if(sunglassesOn) {
        sunglassBtn.innerHTML = 'Sunglasses';
        drawOriginalImage();
        sunglassesOn = false;
    } else {
        sunglassBtn.innerHTML = 'Original picture';
        putSunglassesOn();
        sunglassesOn = true;
    }

})

// --------------- Initial --------------------
image.src = 'guizhou.jpg';
image.onload = () => {
    drawOriginalImage();
}