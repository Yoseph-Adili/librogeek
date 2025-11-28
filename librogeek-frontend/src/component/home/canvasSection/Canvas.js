import Book from "./Book.js";

export default class Canvas {
    constructor(canvas, books) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        const paddingX = 20;
        const paddingY = 30;
        const bookWidth = 100;
        const bookHeight = 150;
        const booksPerRow = 10;
        this.center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }


        this.books = books.map((bookData, i) => {
            const col = i % booksPerRow;
            const row = Math.floor(i / booksPerRow);

            const x = col * (bookWidth + paddingX);
            const y = row * (bookHeight + paddingY);

            return new Book(bookData, x, y, bookWidth, bookHeight);
        });



    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.center.x, this.center.y, 50, 50);
        const centerX = this.center.x;

        this.books.forEach(book => {
            const bookCenter=book.position.x + book.size.width / 2;
            const distanceX = bookCenter - centerX;
            const maxAngle = 0.3;
            const rotation = (distanceX / 300) * maxAngle;
            const scale = 1 + Math.min(Math.abs(distanceX) / 1000, 0.3);


            book.drawAtCenter(this.ctx, rotation, scale);

        });


        this.animationId = requestAnimationFrame(() => this.draw());

        // requestAnimationFrame(() => this.draw());
    }

    start() {
        this.animationId = requestAnimationFrame(() => this.draw());
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }
}