// Raindrop animation on hero section using canvas
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10';
    hero.style.position = 'relative';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    let width, height;
    function resize() {
        width = canvas.width = hero.clientWidth;
        height = canvas.height = hero.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Raindrop properties
    const raindrops = [];
    const maxRaindrops = 50; // moderate density
    const raindropColor = 'rgba(255, 255, 255, 0.3)'; // semi-transparent white
    const raindropMinSize = 1;
    const raindropMaxSize = 3; // small size
    const raindropMinSpeed = 2;
    const raindropMaxSpeed = 4; // medium speed

    class Raindrop {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height;
            this.length = Math.random() * (raindropMaxSize - raindropMinSize) + raindropMinSize;
            this.speed = Math.random() * (raindropMaxSpeed - raindropMinSpeed) + raindropMinSpeed;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.y += this.speed;
            if (this.y > height) {
                this.reset();
            }
        }
        draw() {
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.stroke();
        }
    }

    for (let i = 0; i < maxRaindrops; i++) {
        raindrops.push(new Raindrop());
    }

    let animationId;
    function animate() {
        ctx.clearRect(0, 0, width, height);
        raindrops.forEach(drop => {
            drop.update();
            drop.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    // Reduce animation on mobile devices
    function checkMobile() {
        if (window.innerWidth <= 768) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
                ctx.clearRect(0, 0, width, height);
            }
        } else {
            if (!animationId) {
                animate();
            }
        }
    }

    window.addEventListener('resize', checkMobile);
    checkMobile();
});
