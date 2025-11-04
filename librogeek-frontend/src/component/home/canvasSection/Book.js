export default class Book {
    constructor(book, x, y, width, height) {
        this.cover = book.cover;
        this.link = book.link;
        this.name = book.name;

        this.image = new Image();
        this.image.src = this.cover;

        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
        };

        this.position = {
            x: x,
            y: y,
        }
        this.size = {
            width: width,
            height: height
        }
    }

    draw(ctx) {
        if (!ctx || !this.loaded) return;
        if (this.image.complete) {
            ctx.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height
            )
        }
    }

    drawAtCenter(ctx, progress = 0, scale = 1) {
        if (!ctx || !this.loaded) return;
        ctx.save();

        // 移动到书中心
        const cx = this.position.x + this.size.width / 2;
        const cy = this.position.y + this.size.height / 2;
        ctx.translate(cx, cy);

        // progress: 0 -> 正面, 1 -> 完全翻到背面
        // 水平缩放模拟翻页厚度
        const flipScaleX = Math.cos(progress * Math.PI / 2); // 0~1
        // 倾斜角度模拟透视
        const skew = Math.sin(progress * Math.PI / 2) * 0.3; // 可调节

        // transform(a, b, c, d, e, f)
        ctx.transform(flipScaleX, 0, skew, scale, 0, 0);


        ctx.drawImage(
            this.image,
            -this.size.width / 2,
            -this.size.height / 2,
            this.size.width,
            this.size.height
        );

        ctx.restore();
    }

}