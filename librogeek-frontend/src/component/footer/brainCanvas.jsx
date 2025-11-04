// CanvasSection.jsx
import {useEffect, useRef} from "react";
import BrainCanvas from "./brainCanvas.js";
import brainImg from '/brain.jpg';

const CanvasSection = () => {
    const ref = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
        const root = getComputedStyle(document.documentElement);
        let color = root.getPropertyValue('--text-color').trim();
        console.log(color)
        const canvasElement = ref.current;
        if (!canvasElement) return;

        engineRef.current = new BrainCanvas(canvasElement);

        engineRef.current.start();
        return () => {
            engineRef.current.stop();
            engineRef.current = null;
        };
    }, []);

    return (
        <div style={{width: "100%", height: "100vh"}}>
            <canvas ref={ref} style={{width: "100%", height: "100%"}}/>
        </div>
    );
};

export default CanvasSection;
