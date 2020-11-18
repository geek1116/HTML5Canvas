const canvas = document.querySelector('#canvas'), context = canvas.getContext('2d');

// -------------------- Functions ---------------

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();

    context.shadowColor = 'rgba(200, 200, 0, 0.5)';
    context.shadowOffsetX = 12;
    context.shadowOffsetY = 12;
    context.shadowBlur = 15;

    drawCutouts();
    strokeCutoutsShapes();

    context.resotre();
}

function drawCutouts() {
    context.beginPath();
    addOuterRectanglePath();

    addCirclePath();
    addRectanglePath();
    addTrianglePath();

    context.fill();
}

function strokeCutoutsShapes() {
    context.save();

    context.strokeStyle = 'rgba(0, 0, 0, 0.7)';

    context.beginPath();
    addOuterRectanglePath();
    context.stroke();

    context.beginPath();

    addCirclePath();
    addRectanglePath();
    addTrianglePath();
    context.stroke();

    context.resotre();
}

function rect(x, y, w, h, direction) {
    if(direction) {
        context.moveTo(x, y);
        context.lineTo(x, y + h);
        context.lineTo(x + w, y + h);
        context.lineTo(x + w, y);
        context.closePath();
    } else {
        context.moveTo(x, y);
        context.lineTo(x + w, y);
        context.lineTo(x + w, y + h);
        context.lineTo(x, y + h);
        context.closePath();
    }
}

function addOuterRectanglePath() {
    context.rect(110, 25, 370, 335);
}

function addCirclePath() {
    context.arc(300, 300, 40, 0, Math.PI * 2, true);
}

function addRectanglePath() {
    rect(310, 55, 70, 35, true);
}

function addTrianglePath() {
    context.moveTo(400, 200);
    context.lineTo(250, 115);
    context.lineTo(200, 200);
    context.closePath();
}

// -------------------- Initialization ----------
context.fillStyle = 'goldenrod';
draw();