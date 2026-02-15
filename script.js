const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
const img = new Image();
img.src = "mahadev-parvati.jpg";

class Particle {
    constructor(x, y, color) {
        // Start closer (NOT full random) - visible formation
        this.x = x + (Math.random() - 0.5) * 300;
        this.y = y + (Math.random() - 0.5) * 300;

        this.tx = x;
        this.ty = y;
        this.color = color;

        this.size = 1.3;      // Small = clear face
        this.speed = 0.12;    // Fast formation
    }

    update() {
        this.x += (this.tx - this.x) * this.speed;
        this.y += (this.ty - this.y) * this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;           // Divine glow
        ctx.shadowColor = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

img.onload = () => {
    particles = [];

    const scale = Math.min(
        (canvas.width * 0.85) / img.width,
        (canvas.height * 0.85) / img.height
    );

    const iw = img.width * scale;
    const ih = img.height * scale;
    const ix = (canvas.width - iw) / 2;
    const iy = (canvas.height - ih) / 2;

    ctx.drawImage(img, ix, iy, iw, ih);
    const imgData = ctx.getImageData(ix, iy, iw, ih).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // HIGH DENSITY SAMPLING (FACE CLEAR)
    for (let y = 0; y < ih; y += 2) {
        for (let x = 0; x < iw; x += 2) {
            const i = (Math.floor(y) * Math.floor(iw) + Math.floor(x)) * 4;
            if (imgData[i + 3] > 160) {
                particles.push(
                    new Particle(
                        ix + x,
                        iy + y,
                        `rgb(${imgData[i]},${imgData[i+1]},${imgData[i+2]})`
                    )
                );
            }
        }
    }

    animate();
};

img.onerror = () => {
    // Fallback: Divine Om pattern
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 8000; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 250;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const color = `hsl(${40 + Math.random() * 20}, 100%, ${60 + Math.random() * 20}%)`;
        particles.push(new Particle(x, y, color));
    }
    
    animate();
};

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
}
