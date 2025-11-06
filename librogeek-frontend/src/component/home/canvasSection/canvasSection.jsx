import {useEffect, useRef} from "react";
import Canvas from "./Canvas.js";
import book1Cover from '/book-example.png';
import book2Cover from '/book-example2.png';
import book3Cover from '/book-example3.png';
import book4Cover from '/book-example.png';
import book5Cover from '/book-example2.png';


const CanvasSection = () => {
    const canvasRef = useRef(null)


    useEffect(() => {
        const canvas = canvasRef.current;
        const Books = [
            {cover: book1Cover, link: '/book1', name: 'The Secret Garden'},
            {cover: book2Cover, link: '/book2', name: 'JavaScript Mastery'},
            {cover: book3Cover, link: '/book3', name: 'Learn React'},
            {cover: book4Cover, link: '/book4', name: 'Mystery of the Night'},
            {cover: book5Cover, link: '/book5', name: 'Adventures in Coding'},
            {cover: book1Cover, link: '/book1', name: 'The Secret Garden'},
            {cover: book2Cover, link: '/book2', name: 'JavaScript Mastery'},
            {cover: book3Cover, link: '/book3', name: 'Learn React'},

        ];


        const canvasEngine = new Canvas(canvas, Books)
        canvasEngine.start();
        return () => canvasEngine.stop();
    }, []);
    return (
        <section className="canvas-section" id="canvas-section">
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{
                    width: '100%',
                    height: '100vh'
                }}
            >
            </canvas>
        </section>
    )
}
export default CanvasSection