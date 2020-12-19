class SpriteSheet {
    constructor(cells) {
        this.cells = cells || [];
        this.cellIndex = 0;
    }

    advance() {
        if(this.cellIndex >= this.cells.length - 1) this.cellIndex = 0;
        else ++this.cellIndex;
    }

    paint(sprite, context) {
        let cell = this.cells[this.cellIndex];
        context.drawImage(spriteSheet, cell.x, cell.y, cell.w, cell.h,
            sprite.left, sprite.top, cell.w, cell.h);
    }
}

const runInPlace = {
    lastAdvance: 0,
    PAGEFLIP_INTERVAL: 100,

    execute: function(sprite, context, time) {
        if(time - this.lastAdvance > this.PAGEFLIP_INTERVAL) {
            sprite.painter.advance();
            this.lastAdvance = time;
        }
    }
}

const moveLeftToRight = {
    lastMove: 0,

    execute: function(sprite, context, time) {
        if(this.lastMove !== 0) {
            sprite.left += sprite.velocityX * (time - this.lastMove) / 1000;

            if(sprite.left > canvas.width) sprite.left = -sprite.width;
        }

        this.lastMove = time;
    }
}


const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    animateBtn = document.querySelector('#animateBtn'),
    spriteSheet = new Image(),
    runnerCells = [
        {x: 0, y: 10, w: 100, h:90},
        {x: 100, y: 10, w: 100, h:90},
        {x: 200, y: 10, w: 100, h:90},
        {x: 300, y: 10, w: 100, h:90},
        {x: 400, y: 10, w: 100, h:90},
        {x: 500, y: 10, w: 100, h:90}
    ],
    sprite = new Sprite('runner', new SpriteSheet(runnerCells), [runInPlace, moveLeftToRight]),
    PAGEFLIP_INTERVAL = 100;

let paused = true,
    lastAdvance = 0;

// --------------- Functions ---------------------
function startAnimation() {
    animateBtn.value = 'Pause';
    paused = false;
    requestAnimationFrame(animate);
}

function stopAnimation() {
    animateBtn.value = 'Animate';
    paused = true;
}

function animate(time) {
    if(paused) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(spriteSheet, 0, 0);

    sprite.update(context, time);
    sprite.paint(context);

    requestAnimationFrame(animate);
}


// --------------- Initialization ----------------
spriteSheet.src = 'spritesheet.png';
spriteSheet.onload = () => {
    context.drawImage(spriteSheet, 0, 0);
}

sprite.left = 0;
sprite.top = 300;
sprite.velocityX = 200;  //  pixels/second
sprite.width = 100;

animateBtn.addEventListener('click', () => {
    if(paused) {
        startAnimation();
    } else {
        stopAnimation();
    }
})