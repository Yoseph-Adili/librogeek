import {Link} from "react-router-dom";

const CategoryBook = ({book_cover, book_link, book_title, book_intro}) => {
    return (
        <div className="category-book">
            <Link to={book_link}>
                <img src={book_cover} alt=""/>
            </Link>
            <div className="category-book-info">
                <h2>{book_title}</h2>
                <p>{book_intro}</p>
            </div>
        </div>
    )
}
export default CategoryBook;