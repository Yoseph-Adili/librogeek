import MostReadBook from "./mostReadBook.jsx";
import "./mostReadBook.css"
import {useEffect, useState} from "react";
import book from "../../../pages/book.jsx";
import {API_URL} from "../../../config/api.js";

const MostReadSection = () => {
    const [books, setBooks] = useState([])
    useEffect(() => {
        fetch(`${API_URL}/books/mostRead`)
            .then(res => res.json())
            .then(data => {
                    setBooks(data.data)

                }
            )


    }, []);
    return (
        <section className="most-read-section" id="most-read-section">
            <h2>Most Read Books</h2>
            <div className="most-read-books-container">
                {books?.map((b, i) => (
                <MostReadBook key={i} book_id={b.book_id} book_cover={b.cover_image}/>
                ))}
            </div>
        </section>
    );
};
export default MostReadSection;