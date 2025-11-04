export default class Particle {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color
        this.baseY = this.y;
        this.baseX= this.x;
        this.phase = Math.random() * Math.PI * 2

        this.baseR = r
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color || "white";
        ctx.fill();
    }

    update(time, mouse) {
        const speed = 1.2;
        const amplitude = 5;
        this.y = this.baseY + Math.sin(time * speed + this.phase) * amplitude;

        //size
        // const rAmplitude = 0.3;
        // this.r = this.baseR * (1 + Math.sin(time * speed + this.phase) * rAmplitude);

        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const forceDirX = dx / dist;
                const forceDirY = dy / dist;
                const force = (mouse.radius - dist) / mouse.radius;
                const displacement = force * 10;
                this.x += forceDirX * displacement;
                this.y += forceDirY * displacement;
            } else {

                this.x += (this.baseX - this.x) * 0.05;
                this.y += (this.baseY - this.y) * 0.05;
            }
        }
    }
}