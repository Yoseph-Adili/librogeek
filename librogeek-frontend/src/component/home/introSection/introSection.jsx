import {useEffect, useRef, useState} from "react";
import Logo from "../../logo.jsx";
import './introSection.css';

const IntroSection = () => {
    const [active, setActive] = useState(false);
    const logoRef = useRef(null);

    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const [leftVisible, setLeftVisible] = useState(false);
    const [rightVisible, setRightVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.target === leftRef.current) {
                        if (entry.isIntersecting) setLeftVisible(true);
                    }
                    if (entry.target === rightRef.current) {
                        if (entry.isIntersecting) setRightVisible(true);
                    }
                });
            },
            {threshold: 0.2}
        );

        if (leftRef.current) observer.observe(leftRef.current);
        if (rightRef.current) observer.observe(rightRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <section className="intro-section">
            <div className="intro-container">
                <div ref={leftRef} className={`intro-text-left ${leftVisible ? "visible" : ""}`}>
                    <h2><span></span>Libro</h2>
                    <p>We turn reading into connection. Every book you open sparks curiosity, every visit deepens
                        discovery — making Libro Geek a place readers return to, again and again.</p> <p>“A reader lives
                    a thousand lives before he dies.” — George R.R. Martin </p>
                </div>

                <div ref={rightRef} className={`intro-text-right ${rightVisible ? "visible" : ""}`}>
                    <p>We build a reading platform so intuitive that engagement grows naturally — readers stay longer,
                        explore more titles, and turn one session into a lasting reading habit.</p>
                    <p>“Once you learn
                    to read, you will be forever free.” — Frederick Douglass</p>
                    <h2>Geek<span></span></h2>
                </div>
            </div>

            <div className="home-logo-container" ref={logoRef}>
                <Logo className={`home-logo ${active ? "active" : ""}`}/>
            </div>
        </section>
    );
};

export default IntroSection;
