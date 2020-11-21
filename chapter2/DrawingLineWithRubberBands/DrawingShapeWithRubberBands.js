let canvas = document.querySelector('#canvas'),
    context  = canvas.getContext('2d'),
    eraseAllButton = document.querySelector('#eraseAllButton'),
    strokeStyleSelect = document.querySelector('#strokeStyleSelect'),
    strokeShapeSelect = document.querySelector('#strokeShapeSelect'),
    guidewireCheckbox = document.querySelector('#guidewireCheckbox'),
    guidewires = guidewireCheckbox.checked,
    drawingSurfaceImageData,
    dragging = false,
    mousedown = {},
    rubberbandRectangle = {};

// -------------- Functions --------------------

function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    }
}

// -------------- Save and resotre drawing surface --------------

function saveDrawingSurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function resotreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0);
}

// -------------- Rubber bands ------------------

function updateRubberband(loc) {
    updateRubberbandRectangle(loc);
    switch(strokeShapeSelect.value) {
        case 'line':
            drawRubberbandShape(loc);
            break;
        case 'circle':
            drawRubberbandsShape_Circle(loc);
            break;
    }
}

function updateRubberbandRectangle(loc) {   // calculate rectangle's geometric info
    rubberbandRectangle.left = loc.x < mousedown.x ? loc.x : mousedown.x;
    rubberbandRectangle.top = loc.y < mousedown.y ? loc.y : mousedown.y;

    rubberbandRectangle.width = Math.abs(loc.x - mousedown.x);
    rubberbandRectangle.height = Math.abs(loc.y - mousedown.y);
}

function drawRubberbandShape(loc) {
    context.beginPath();
    context.moveTo(mousedown.x, mousedown.y);
    context.lineTo(loc.x, loc.y);
    context.stroke();
}

function drawRubberbandsShape_Circle(loc) {
    let radius = Math.sqrt(Math.pow(loc.x - mousedown.x, 2) + Math.pow(loc.y - mousedown.y, 2));

    context.beginPath();
    context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2, false);
    context.stroke();
}

// -------------- Guidewires -------------------

function drawHorizontalLine(y) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(canvas.width, y + 0.5);
    context.stroke();
}

function drawVerticalLine(x) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, canvas.height);
    context.stroke();
}

function drawGuidewires(x, y) {
    context.save();

    context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    context.lineWidth = 1;
    context.setLineDash([4, 2]);
    context.lineDashOffset = 0;

    drawVerticalLine(x);
    drawHorizontalLine(y);

    context.restore();
}

// -------------- Canvas event handlers ---------

canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();

    saveDrawingSurface();

    const loc = windowToCanvas(e.clientX, e.clientY);
    mousedown.x = loc.x, mousedown.y = loc.y;

    dragging = true;
});

document.addEventListener('mousemove', (e) => {
    if(dragging) {
        e.preventDefault();

        resotreDrawingSurface();

        const loc = windowToCanvas(e.clientX, e.clientY);
        updateRubberband(loc);

        if(guidewires) {
            drawGuidewires(loc.x, loc.y);
        }
    }
});

document.addEventListener('mouseup', (e) => {
    if(dragging) {
        const loc = windowToCanvas(e.clientX, e.clientY);
        resotreDrawingSurface();
        updateRubberband(loc);
        dragging = false;
    }
});

// -------------- Controls event handlers --------

eraseAllButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveDrawingSurface();
});

strokeStyleSelect.addEventListener('change', () => {
    context.strokeStyle = strokeStyleSelect.value;
});

guidewireCheckbox.addEventListener('change', () => {
    guidewires = guidewireCheckbox.checked;
});

// -------------- Initialization -----------------

context.strokeStyle = strokeStyleSelect.value;