import './introSection.css';
import Logo from "../../logo.jsx";
import { useEffect, useRef, useState } from "react";


const IntroSection = () => {
    const [active, setActive] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setActive(entry.isIntersecting);
            },
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);


    return (
        <section className="intro-section">
            <div className="intro-container">
                <div className="intro-text-left">
                    <h2>
                        <span></span>
                        Libro
                    </h2>
                    <p>We turn reading into connection. Every book you open sparks curiosity, every visit deepens
                        discovery — making Libro Geek a place readers return to, again and again.</p>

                    <p>“A reader lives a thousand lives before he dies.” — George R.R. Martin
                    </p>
                </div>

                <div className="intro-text-right">

                    <p>We build a reading platform so intuitive that engagement grows naturally — readers stay longer,
                        explore more titles, and turn one session into a lasting reading habit.</p>
                    <p>“Once you learn to read, you will be forever free.” — Frederick Douglass</p>

                    <h2>

                        Geek
                        <span></span>
                    </h2>
                </div>
            </div>
            <div className="home-logo-container" ref={ref}>
                <Logo className={`home-logo ${active ? "active" : ""}`}/>
            </div>
        </section>
    );
};

export default IntroSection;