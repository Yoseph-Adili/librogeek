export default class Particle {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color
        this.baseY = this.y;
        this.phase = Math.random() * Math.PI * 2

        this.baseR = r
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color || "white";
        ctx.fill();
    }

    update(time) {
        const speed = 1.2;
        const amplitude = 5;
        this.y = this.baseY + Math.sin(time * speed + this.phase) * amplitude;

        //size
        // const rAmplitude = 0.3;
        // this.r = this.baseR * (1 + Math.sin(time * speed + this.phase) * rAmplitude);

    }
}