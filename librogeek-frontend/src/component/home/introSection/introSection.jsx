import './introSection.css';
import Logo from "../../logo.jsx";


const IntroSection = () => {
    return (
        <section className="intro-section">
            <div>
                <h2>DISCOVER YOUR NEXT FAVORITE BOOK</h2>
                <p>At LibroGeek, we believe that books have the power to transform lives. Whether you're a casual reader
                    or a dedicated bibliophile, our platform is designed to help you find, explore, and connect with the
                    stories that matter most to you.</p>
                <p>Join our community of book lovers today and embark on a literary journey like no other!</p>
            </div>
            <div className="home-logo-container">
            <Logo className="home-logo" />
            </div>
            <div>
                <h2>DISCOVER YOUR NEXT FAVORITE BOOK</h2>
                <p>At LibroGeek, we believe that books have the power to transform lives. Whether you're a casual reader
                    or a dedicated bibliophile, our platform is designed to help you find, explore, and connect with the
                    stories that matter most to you.</p>
                <p>Join our community of book lovers today and embark on a literary journey like no other!</p>
            </div>
        </section>
    );
};

export default IntroSection;