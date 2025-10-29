import './heroSection.css';
import CustomizeTitleLink from "./customizeTitleLink.jsx";

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="container">
                <h1>LIBROGEEK</h1>
                <h1>WHERE STORIES LIVE</h1>
                <h1>
                    <CustomizeTitleLink to="/books" startUp={false}>READING.</CustomizeTitleLink>
                </h1>
                <h1>CONNECTION. DISCOVERY.</h1>
                <h1>
                    <CustomizeTitleLink to="/login" startUp={true}>→LOGIN</CustomizeTitleLink>
                    <CustomizeTitleLink to="/books" startUp={false}>→BOOKS</CustomizeTitleLink>
                </h1>
                <div
                    className="title-link-background"
                ></div>
            </div>
        </section>
    );
};

export default HeroSection;