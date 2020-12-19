const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    CLOCK_RADIUS = canvas.width / 2 - 15,
    HOUR_HAND_TRUNCATION = 35;

const ballPainter = {
    paint: function(sprite, context) {
        let x = sprite.left + sprite.width / 2,
            y = sprite.top + sprite.height / 2,
            radius = sprite.width / 2;
        
        context.save();
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.clip();
        context.shadowColor = 'rgb(0,0,0)';
        context.shadowOffsetX = -4;
        context.shadowOffsetY = -4;
        context.shadowBlur = 8;
        context.fillStyle = 'rgba(218,165,32, 0.1)';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'rgb(100,100,195)';
        context.stroke();
        context.restore();
    }
},
ball = new Sprite('ball', ballPainter);

// --------------- Function --------------------
function drawClock() {
    drawClockFace();
    drawHands();
}

function drawClockFace() {
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, CLOCK_RADIUS, 0, Math.PI * 2, false);
    context.save();
    context.strokeStyle = 'rgba(0,0,0,0.2)';
    context.stroke();
    context.restore();
}

function drawHands() {
    const date = new Date();
    let hour = date.getHours();
    
    hour = hour > 12 ? hour - 12 :hour;

    ball.width = ball.height = 20;
    drawHand(date.getSeconds(), false);

    ball.width = ball.height = 35;
    drawHand(date.getMinutes(), false);

    ball.width = ball.height = 50;
    drawHand((hour + date.getMinutes() / 60) * 5, true);

    ball.width = ball.height = 10;
    ball.left = canvas.width / 2 - ball.width / 2;
    ball.top = canvas.height / 2 - ball.height / 2;
    ball.paint(context);
}

function drawHand(loc, isHour) {
    const angle = Math.PI * 2 * (loc / 60) - Math.PI / 2,
        handRadius = isHour ? CLOCK_RADIUS - HOUR_HAND_TRUNCATION : CLOCK_RADIUS,
        lineEnd = {
            x: canvas.width / 2 + Math.cos(angle) * (handRadius - ball.width / 2),
            y: canvas.height / 2 + Math.sin(angle) * (handRadius - ball.height / 2)
        };

    context.beginPath();
    context.moveTo(canvas.width / 2, canvas.height / 2);
    context.lineTo(lineEnd.x, lineEnd.y);
    context.stroke();

    ball.left = canvas.width / 2 + Math.cos(angle) * handRadius - ball.width / 2;
    ball.top = canvas.height / 2 + Math.sin(angle) * handRadius - ball.height / 2;
    ball.paint(context);
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawClock();
    requestAnimationFrame(animate);
}

// --------------- Initialization --------------
requestAnimationFrame(animate);