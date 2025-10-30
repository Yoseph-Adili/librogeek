import './heroSection.css';
import CustomizeTitleLink from "./customizeTitleLink.jsx";
import TopBook from "./topbook.jsx";


const HeroSection = () => {
    return (
        <section className="hero-section">
            <TopBook
                cover_link={"/book-example2.png"}
                book_link={"/book"}
                book_title={"THE GREAT ADVENTURE"}
                book_intro={"Join us on an unforgettable journey through uncharted territories and thrilling escapades."}
            />
            <div className="container">

                <h1>LIBROGEEK</h1>
                <h1>WHERE STORIES LIVE</h1>

                    <CustomizeTitleLink to="/books" startUp={false}>READING.</CustomizeTitleLink>

                <h1>CONNECTION. DISCOVERY.</h1>

                <CustomizeTitleLink to="/login" startUp={true}>→LOGIN</CustomizeTitleLink>
                <CustomizeTitleLink to="/contact" startUp={false}>→CONTACT</CustomizeTitleLink>

                <div
                    className="title-link-background"
                >

                </div>
            </div>
            <TopBook
                cover_link={"/book-example.png"}
                book_link={"/book"}
                book_title={"THE GREAT ADVENTURE"}
                book_intro={"Join us on an unforgettable journey through uncharted territories and thrilling escapades."}

            />
        </section>
    );
};

export default HeroSection;