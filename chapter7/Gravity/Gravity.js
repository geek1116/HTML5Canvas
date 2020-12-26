const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    GRAVITY_FORCE = 9.81,
    FALLING_HEIGHT_IN_PIXEL = 500,
    FALLING_HEIGHT_IN_METERS = 10,
    pixelsPerMeter = FALLING_HEIGHT_IN_PIXEL / FALLING_HEIGHT_IN_METERS,
    btn = document.querySelector('#btn'),
    RADISU = 50;

let running = false;
let lastTime = 0, startTime = 0;
let moveBall = {
    execute: function(sprite, context, time) {
        let elapsedTime = time - lastTime;

        sprite.velocityY += GRAVITY_FORCE * (elapsedTime / 1000) * pixelsPerMeter;
        sprite.top += sprite.velocityY * (elapsedTime / 1000);

        if(sprite.top + RADISU >= canvas.height) {
            sprite.velocityY = -sprite.velocityY;
            sprite.top = canvas.height - RADISU;
        }
    }
};
let sprite = new Sprite('ball', {
    paint: function(sprite, context) {
        context.save();
        
        context.beginPath();
        context.arc(sprite.left, sprite.top, RADISU, 0, Math.PI * 2, false);
        context.clip();
        context.shadowColor = 'rgb(0, 0, 0)';
        context.shadowOffsetX = -4;
        context.shadowOffsetY = -4;
        context.shadowBlur = 5;
        context.lineWidth = 1;
        context.strokeStyle = 'rgb(100, 100, 195)';
        context.fillStyle = 'rgba(30, 144, 255, 0.15)';
        context.fill();
        context.stroke();

        context.restore();
    }
}, [moveBall])

// ---------------------------- Functions --------------------------------
function animate(time) {
    if(startTime === 0) startTime = time;

    context.clearRect(0, 0, canvas.width, canvas.height);

    if(running) {
        sprite.update(context, time);
    }

    sprite.paint(context);
    lastTime = time;

    requestAnimationFrame(animate);
}

// ---------------------------- Event Handler ----------------------------
btn.addEventListener('click', () => {
    if(running) {
        running = false;
        btn.value = 'Play';
        
        sprite.left = 300;
        sprite.top = 100;
        sprite.velocityY = 0;
        startTime = 0;
    } else {
        running = true;
        btn.value = 'Reset';
    }
})

// ----------------------------- Initialization ---------------------------
sprite.left = 300;
sprite.top = 100;
requestAnimationFrame(animate);