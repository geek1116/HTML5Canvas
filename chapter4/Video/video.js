const canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        offscreenCanvas = document.createElement('canvas'),
        offscreenContext = offscreenCanvas.getContext('2d'),
        video = document.querySelector('#video'),
        controlBtn = document.querySelector('#controlButton'),
        colorCheckbox = document.querySelector('#controlCheckbox'),
        flipCheckbox = document.querySelector('#flipCheckbox');

offscreenCanvas.widht = canvas.width, offscreenCanvas.height = canvas.height;

let imageData = null;

// ---------------- Functions --------------------
function startPlaying() {
    requestAnimationFrame(nextVideoFrame)
    video.play();
}

function stopPlaying() {
    video.pause();
}

function nextVideoFrame() {
    if(video.ended) {
        controlBtn.value = 'Play';
        return;
    }

    offscreenContext.drawImage(video, 0, 0);

    if(!colorCheckbox.checked) {
        removeColor();
    }

    if(flipCheckbox.checked) {
        drawFlipped();
    } else {
        context.drawImage(offscreenCanvas, 0, 0);
    }

    requestAnimationFrame(nextVideoFrame);
}

function removeColor() {
    let data, avg;

    imageData = offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    data = imageData.data;
    for(let i = 0; i < data.length; i += 4) {
        avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = data[i+1] = data[i+2] = avg;
    }

    offscreenContext.putImageData(imageData, 0, 0)
}

function drawFlipped() {
    context.save();

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(Math.PI);
    context.translate(-canvas.width / 2, -canvas.height / 2);
    context.drawImage(offscreenCanvas, 0, 0);

    context.restore();
}

// ---------------- Event Handler ----------------
controlBtn.addEventListener('click', () => {
    if(controlBtn.value === 'Play') {
        startPlaying();
        controlBtn.value = 'Stop';
    } else {
        stopPlaying();
        controlBtn.value = 'Play';
    }
})
