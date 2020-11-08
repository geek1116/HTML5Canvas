const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    rubberbanDiv = document.querySelector('#rubberbanDiv'),
    resetButton = document.querySelector('#resetButton'),
    image = new Image(),
    bbox = canvas.getBoundingClientRect();
console.log(bbox);
let dragging = false,
    mousedown = {},
    rubberbandRectangle = {};

// ---------------- Functions --------------------------

function rubberbandStart(x, y) {
    mousedown.x = x, mousedown.y = y;

    rubberbandRectangle.left = x, rubberbandRectangle.top = y;
    moveRubberbandDiv();
    showRubberbandDiv();

    dragging = true;
}

function rubberbandStretch(x, y) {
    rubberbandRectangle.left = x < mousedown.x ? x : mousedown.x;
    rubberbandRectangle.top = y < mousedown.y ? y : mousedown.y;

    rubberbandRectangle.width = Math.abs(x - mousedown.x);
    rubberbandRectangle.height = Math.abs(y - mousedown.y);

    moveRubberbandDiv();
    resizeRubberbandDiv();
}

function rubberbandEnd() {
    context.drawImage(canvas,
        rubberbandRectangle.left - bbox.left,
        rubberbandRectangle.top - bbox.top,
        rubberbandRectangle.width,
        rubberbandRectangle.height,
        0, 0, canvas.width, canvas.height);

    resetRubberbandRectangle();
    rubberbanDiv.style.width = 0;
    rubberbanDiv.style.height = 0;

    hideRubberbandDiv();

    dragging = false;
}


function moveRubberbandDiv() {
    rubberbanDiv.style.top = rubberbandRectangle.top + 'px';
    rubberbanDiv.style.left = rubberbandRectangle.left + 'px';
}

function resizeRubberbandDiv() {
    rubberbanDiv.style.width = rubberbandRectangle.width + 'px';
    rubberbanDiv.style.height = rubberbandRectangle.height + 'px';
}

function showRubberbandDiv() {
    rubberbanDiv.style.display = 'inline-block';
}

function hideRubberbandDiv() {
    rubberbanDiv.style.display = 'none';
}

function resetRubberbandRectangle() {
    rubberbandRectangle = { top: 0, left: 0, width: 0, height: 0};
}

// ---------------- Event handlers ---------------------

canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    rubberbandStart(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if(dragging) {
        const x = e.clientX < bbox.left ? bbox.left : (e.clientX > bbox.left + bbox.width -5 ? bbox.left + bbox.width - 5 : e.clientX),
            y = e.clientY < bbox.top ? bbox.top : (e.clientY > bbox.top + bbox.height - 5 ? bbox.top + bbox.height - 5 : e.clientY);
        rubberbandStretch(x, y);
    }
});

window.addEventListener('mouseup', (e) => {
    e.preventDefault();
    rubberbandEnd();
});

resetButton.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
});

image.onload = () => {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

image.src = 'cookie.jpg';