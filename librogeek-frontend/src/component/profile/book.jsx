import {Link} from "react-router-dom";
import {STATIC_URL} from "../../config/api.js";

const Book = ({ book, index }) => {
    return (
        <div
            className="profile-book"
            style={{ '--i': index }}
        >
            <div className="profile-book-cover">
                <Link to={`/book/${book.bookId}`}>
                    <img src={STATIC_URL + "/" + book.cover_image} alt="" />
                </Link>
            </div>

            <div className="profile-book-text">
                <h2><Link to={`/book/${book.bookId}`}>{book.title}</Link></h2>
                <p>{book.description}</p>
            </div>
        </div>
    );
}

export default Book;