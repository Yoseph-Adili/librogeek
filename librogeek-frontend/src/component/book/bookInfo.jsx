import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {API_URL, STATIC_URL} from "../../config/api.js";

const BookInfo = ({book}) => {

    const [bookInBookshelf, setBookInBookshelf] = useState(false)
    const tags = book.tags || [];

    const category = "gfd"
    const type = "PDF"

    return (<div className="book-info-container">
        <div className="book-cover">

            <img src={STATIC_URL + "/" + book.cover_image} alt=""/>
        </div>
        <div className="book-info">
            <h1>{book.title}</h1>
            <a href="">{book.author}</a>
            <p>{book.description}</p>
            <div style={{'--i': 2}} className="type-container">

                <div className="type">
                    <p>Category</p>


                    <Link to={`/books/category/${book.category}`}>{book.category}</Link>

                </div>
                <div className="type">
                    <p>Type</p>

                    <Link to={"4"}>{book.book_type}</Link>

                </div>
            </div>
            <div style={{'--i': 2}} className="tag-container">
                <p>Tag</p>
                <div className="tag-options">

                    {tags.map((option, index) => (<Link to={"4"} key={index}>
                        {option.tag}
                    </Link>))}
                    <span className={"add-options"}>+</span>
                </div>
            </div>
            <div className="price-container"></div>
            <div className={"buttons-container"}>

                <span className={"read-book-btn"}>Read</span>
                <span className={"add-to-bookshelf-btn"} onClick={() => setBookInBookshelf(!bookInBookshelf)}>

<svg viewBox="0 0 491 686" fill={bookInBookshelf ? "var(--text-color)" : "none"} xmlns="http://www.w3.org/2000/svg">
<path d="M465.5 25H25V625L242 467.5L465.5 635.5V25Z" stroke="var(--text-color)" strokeWidth="50"/>
</svg>

                    </span>
            </div>
        </div>
    </div>)
}
export default BookInfo