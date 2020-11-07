const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    FONT_HEIGHT = 15,
    MARGIN = 35,
    HAND_TRUNCATION = canvas.width / 25,
    HOUR_HAND_TRUNCATION = canvas.width / 10,
    NUMERAL_SPACING = 20,
    RADIUS = canvas.width / 2 - MARGIN,
    HAND_RADIUS = RADIUS + NUMERAL_SPACING;


function drawCircle() {
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, Math.PI * 2, true);
    context.stroke();
}

function drawCenter() {
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2, true);
    context.fill();
}

const numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
function drawNumerals() {
    let angle = 0, numeralWidth = 0;

    numerals.forEach(numeral => {
        angle = (Math.PI / 6) * (numeral - 3);
        numeralWidth = context.measureText(numeral).width;
        context.fillText(numeral, canvas.width / 2 + Math.cos(angle) * HAND_RADIUS - numeralWidth / 2, canvas.height / 2 + Math.sin(angle) * HAND_RADIUS + FONT_HEIGHT / 3);
    });
}

function drawHand(loc, handRadius) {
    const angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2;

    context.moveTo(canvas.width / 2, canvas.height / 2);
    context.lineTo(canvas.width / 2 + Math.cos(angle) * handRadius, canvas.height / 2 + Math.sin(angle) * handRadius);
    context.stroke();
}

function DrawHands() {
    let date = new Date, hour = date.getHours();

    hour = hour > 12 ? hour - 12 : hour;

    drawHand(hour * 5 + (date.getMinutes() / 60) * 15, RADIUS / 2);
    drawHand(date.getMinutes(), RADIUS * 3 / 4);
    drawHand(date.getSeconds(), RADIUS * 5 / 6);
}

function drawClock() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawCircle();
    drawCenter();
    drawNumerals();
    DrawHands();
}

context.font = FONT_HEIGHT + 'px Arial';
var loop = setInterval(drawClock, 1000);