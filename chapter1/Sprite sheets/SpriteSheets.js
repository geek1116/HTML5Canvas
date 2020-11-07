let canvas = document.querySelector('#canvas'),
    readout = document.querySelector('#readout'),
    context = canvas.getContext('2d'),
    spritesheet = new Image();


// ------------------- Functions ----------------------------

function windowToCanvas(canvas, x, y) {
    let bbox = canvas.getBoundingClientRect();
    console.log(x, y);

    return {
        x: (x - bbox.left) * (canvas.width / bbox.width),
        y: (y - bbox.top) * (canvas.height / bbox.height)
    };
}

function drawSpritesheet() {
    context.drawImage(spritesheet, 0, 0);
}

function drawGuidelines(x, y) {
    context.strokeStyle = 'rgba(0, 0, 230, 0.8)';
    context.lineWidth = 0.5;
    drawVerticalLine(x);
    drawHorizontalLine(y);
}

function drawVerticalLine(x) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, canvas.height);
    context.stroke();
}

function drawHorizontalLine(y) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(canvas.width, y + 0.5);
    context.stroke();
}

function updateReadout(x, y) {
    readout.innerHTML = `(${x.toFixed(0)}, ${y.toFixed(0)})`;
}


// -------------------- Event handler -------------------------

canvas.addEventListener('mousemove', (e) => {
    let loc = windowToCanvas(canvas, e.clientX, e.clientY);

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawSpritesheet();
    drawGuidelines(loc.x, loc.y);
    updateReadout(loc.x, loc.y);
});

// ----------------------- Initialization-------------------

spritesheet.src = 'xpydld.png';
spritesheet.onload = (e) => {
    drawSpritesheet();
}