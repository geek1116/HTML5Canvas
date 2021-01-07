const canvas = document.querySelector('#canvas'),
    context  = canvas.getContext('2d'),
    sidesSelect = document.querySelector('#sides-input'),
    startAngleSelect = document.querySelector('#start-angle-input'),
    isEditingCheckbox = document.querySelector('#isEditingCheckbox'),
    eraseAllButton = document.querySelector('#eraseAllButton');

let drawingSurfaceImageData,
    dragging = false,
    mousedown = {},
    rubberbandRectangle = {},
    draggingOffsetX,
    draggingOffsetY,
    sides = 3,
    startAngle = 0,
    editing = false,
    polygons = [];


// -------------- Functions --------------------

function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect();
    return {
        x: (x - bbox.left) * (canvas.width / bbox.width),
        y: (y - bbox.top) * (canvas.height / bbox.height)
    }
}

// -------------- Save and resotre drawing surface --------------

function saveDrawingSurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function resotreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0);
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

// -------------- Rubber bands ------------------

function updateRubberband(loc, sides, startAngle) {
    updateRubberbandRectangle(loc);
    drawRubberbandShape(loc, sides, startAngle);
}

function updateRubberbandRectangle(loc) {   // calculate rectangle's geometric info
    rubberbandRectangle.left = loc.x < mousedown.x ? loc.x : mousedown.x;
    rubberbandRectangle.top = loc.y < mousedown.y ? loc.y : mousedown.y;

    rubberbandRectangle.width = Math.abs(loc.x - mousedown.x);
    rubberbandRectangle.height = Math.abs(loc.y - mousedown.y);
}

function drawRubberbandShape(loc, sides, startAngle) {
    const polygon = new Polygon(mousedown.x, mousedown.y, rubberbandRectangle.width, sides, (Math.PI / 180) * startAngle);
    drawPolygon(polygon);

    if(!dragging) {     // add this polygon after mouseup event
        polygons.push(polygon);
    }
}

function drawPolygon(polygon) {
    context.beginPath();
    polygon.createPath(context);
    polygon.draw(context);
}

function drawPolygons() {
    polygons.forEach(polygon => {
        drawPolygon(polygon);
    });
}

// --------------- Dragging ----------------------

function startDragging(loc) {
    saveDrawingSurface();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
}

function startEditing() {
    canvas.style.cursor = 'pointer';
    editing = true;
}

function stopEditing() {
    canvas.style.cursor = 'crosshair';
    editing = false;
}

// --------------- Event handlers ----------------

canvas.addEventListener('mousedown', (e) => {
    const loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();

    if(editing) {
        for(let i = polygons.length - 1; i >= 0; --i) {
            polygons[i].createPath(context);
            if(context.isPointInPath(loc.x, loc.y)) {
                dragging = polygons[i];
                draggingOffsetX = loc.x - polygons[i].x;
                draggingOffsetY = loc.y - polygons[i].y;
                return;
            }
        }

    } else {
        startDragging(loc);
        dragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    const loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();

    if(dragging) {
        if(editing) {
            dragging.x = loc.x - draggingOffsetX;
            dragging.y = loc.y - draggingOffsetY;
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawPolygons();
        } else {
            resotreDrawingSurface();
            updateRubberband(loc, sides, startAngle);
            drawGuidewires(loc.x, loc.y);
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    const loc = windowToCanvas(e.clientX, e.clientY);

    dragging = false;

    if(!editing) {
        resotreDrawingSurface();
        updateRubberband(loc, sides, startAngle);
    }
});

eraseAllButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    polygons = [];
});

isEditingCheckbox.addEventListener('change', (e) => {
    if(e.target.checked) {
        startEditing();
    } else {
        stopEditing();
    }
});

sidesSelect.addEventListener('input', (e) => {
    const value = e.target.value;

    if(isNaN(value)) e.target.value = 3;
    if(parseInt(value) < 3) e.target.value = 3;
    if(parseInt(value) > 10) e.target.value = 10;

    sides = parseInt(e.target.value);
});

startAngleSelect.addEventListener('input', (e) => {
    const value = e.target.value;

    if(isNaN(value)) e.target.value = 3;
    if(parseInt(value) < 0) e.target.value = 0;
    if(parseInt(value) > 360) e.target.value = 360;

    startAngle = parseInt(e.target.value);
});

// --------------- Initialization ----------------

context.strokeStyle = '#ac9e9e';
context.fillStyle = '#ac9e9e';
context.shadowColor = 'rgba(0, 0, 0, 0.4)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4;