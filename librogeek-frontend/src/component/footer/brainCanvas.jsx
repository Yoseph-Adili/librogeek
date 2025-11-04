// CanvasSection.jsx
import {useEffect, useRef} from "react";
import BrainCanvas from "./brainCanvas.js";

const CanvasSection = () => {
    const ref = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
        const canvasElement = ref.current;
        if (!canvasElement) return;

        const engine = new BrainCanvas(canvasElement);
        engineRef.current = engine;
        engine.resize();

        const handleResize = () => {
            engine.resize();
            engine.createParticlesFromImage();
        };

        window.addEventListener('resize', handleResize);
        engine.start();

        return () => {
            window.removeEventListener('resize', handleResize);
            engine.stop();
            engineRef.current = null;
        };
    }, []);


    return (

        <canvas ref={ref} style={{width: "100%", height: "100%"}}/>

    );
};

export default CanvasSection;
