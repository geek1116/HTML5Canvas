const canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d'),
        animateBtn = document.querySelector('#animateBtn');

let paused = true,
    discs= [

        {
            x: 50,
            y: 150,
            velocityX: 2.2,
            velocityY: 2.5,
            radius: 25.0,
            innerColor: 'rgba(100, 145, 230, 1)',
            middleColor: 'rgba(100, 145, 230, 0.7)',
            outerColor: 'rgba(100, 145, 230, 0.5)',
            strokeStyle: 'blue'
        },
        {
            x: 150,
            y: 250,
            velocityX: -3.2,
            velocityY: 3.5,
            radius: 25.0,
            innerColor: 'rgba(255, 255, 0, 1)',
            middleColor: 'rgba(255, 255, 0, 0.7)',
            outerColor: 'rgba(255, 255, 0, 0.5)',
            strokeStyle: 'gray'
        },
        {
            x: 150,
            y: 75,
            velocityX: 1.2,
            velocityY: 1.5,
            radius: 25.0,
            innerColor: 'rgba(255, 0, 0, 1)',
            middleColor: 'rgba(255, 0, 0, 0.7)',
            outerColor: 'rgba(255, 0, 0, 0.5)',
            strokeStyle: 'orange'
        }
    ];


// ----------------------------------------------------

function update() {
    discs.forEach(disc => {
        if(disc.x + disc.velocityX - disc.radius < 0 || disc.x + disc.velocityX + disc.radius > canvas.width) {
            disc.velocityX = -disc.velocityX;
        }
        if(disc.y + disc.velocityY - disc.radius < 0 || disc.y + disc.velocityY + disc.radius > canvas.height) {
            disc.velocityY = -disc.velocityY;
        }

        disc.x = disc.x + disc.velocityX;
        disc.y = disc.y + disc.velocityY;
    })
}

function draw() {
    discs.forEach(disc => {
        let gradient = context.createRadialGradient(disc.x, disc.y, 0, disc.x, disc.y, disc.radius);
        gradient.addColorStop(0.3, disc.innerColor);
        gradient.addColorStop(0.5, disc.middleColor);
        gradient.addColorStop(1.0, disc.outerColor);

        context.save();
        context.beginPath();
        context.arc(disc.x, disc.y, disc.radius, 0, Math.PI * 2, false);
        context.fillStyle = gradient;
        context.strokeStyle = disc.strokeStyle;
        context.fill();
        context.stroke();
        context.restore();
    })
}

function animate() {
    if(!paused) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        update();
        draw();

        requestAnimationFrame(animate);
    }
}

// ----------------------------------------------------

animateBtn.addEventListener('click', () => {
    paused = !paused;
    if(paused) {
        animateBtn.value = 'Animate';
    } else {
        animateBtn.value = 'Pause';
        requestAnimationFrame(animate);
    }
})