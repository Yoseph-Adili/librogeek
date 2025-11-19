import './heroSection.css';
import CustomizeTitleLink from "./customizeTitleLink.jsx";
import TopBook from "./topbook.jsx";
import {useEffect, useState} from "react";
import {API_URL, STATIC_URL} from "../../../config/api.js";


const HeroSection = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/books/getMostDownloaded`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.data); // make sure backend returns array
            })
            .catch(err => console.error(err));
    }, []);

    const firstBook = books?.[0] ?? null;
    const secondBook = books?.[1] ?? null;

    console.log(books)
    return (
        <section className="hero-section" id="hero-section">
            {firstBook && (
                <TopBook
                    cover_link={STATIC_URL + "/" + firstBook.cover_image}
                    book_link={"/books/" + firstBook.book_id}
                    book_title={firstBook.title}
                    book_intro={firstBook.description}
                />
            )}

            <div className="container">
                <h1>LIBROGEEK</h1>
                <h1>WHERE STORIES LIVE</h1>

                <CustomizeTitleLink to="/books" startUp={false}>READING.</CustomizeTitleLink>
                <h1>CONNECTION. DISCOVERY.</h1>
                <CustomizeTitleLink to="/login" startUp={true}>→LOGIN</CustomizeTitleLink>
                <CustomizeTitleLink to="/contact" startUp={false}>→CONTACT</CustomizeTitleLink>

                <div className="title-link-background"></div>
            </div>
            {secondBook && (
                <TopBook
                    cover_link={STATIC_URL + "/" + secondBook.cover_image}
                    book_link={"/books/" + secondBook.book_id}
                    book_title={secondBook.title}
                    book_intro={secondBook.description}
                />)}
        </section>
    );
};


export default HeroSection;