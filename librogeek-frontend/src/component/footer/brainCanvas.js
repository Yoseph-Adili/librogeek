import Particle from "./particle.js";

export default class BrainCANVAS {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = []

        this.resize();
        window.addEventListener('resize', () => this.resize());


        this.image = new Image();
        this.image.src = 'brain.jpg'
        this.imageLoaded = false;

        this.image.onload = () => {
            this.imageLoaded = true;
            this.createParticlesFromImage();
        };
        const root = getComputedStyle(document.documentElement);
        this.particleColor = root.getPropertyValue('--text-color').trim();

    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const root = getComputedStyle(document.documentElement);
        const color = root.getPropertyValue('--text-color').trim();
        const time = performance.now() / 1000
        console.log(color)
        this.particles.forEach((p) => {
            p.color=color;
            p.update(time)
            p.draw(this.ctx)
        })


        this.animationId = requestAnimationFrame(() => this.draw());

        // requestAnimationFrame(() => this.draw());
    }

    resize() {
        const width = this.canvas.clientWidth || this.canvas.width;
        const height = this.canvas.clientHeight || this.canvas.height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    createParticlesFromImage() {
        if (!this.imageLoaded) return;

        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.image.width;
        tempCanvas.height = this.image.height;

        const tmpCtx = tempCanvas.getContext('2d');
        tmpCtx.drawImage(this.image, 0, 0)

        const imageData = tmpCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        const sample = 2;
        const threshold = 200;

        this.particles = [];

        const canvasW = this.canvas.width;
        const canvasH = this.canvas.height;
        const scale = Math.min(canvasW / tempCanvas.width, canvasH / tempCanvas.height) * 0.9;
        const offsetX = (canvasW - tempCanvas.width * scale) / 2;
        const offsetY = (canvasH - tempCanvas.height * scale) / 2;
        for (let y = 0; y < tempCanvas.height; y += sample) {
            for (let x = 0; x < tempCanvas.width; x += sample) {
                const idx = (y * tempCanvas.width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const brightness = (r + g + b) / 3;

                if (brightness < threshold) {
                    const px = offsetX + x * scale;
                    const py = offsetY + y * scale;
                    this.particles.push(new Particle(px, py, 1.5, this.particleColor));
                }
            }
        }
    }

    start() {
        this.animationId = requestAnimationFrame(() => this.draw());
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }

}