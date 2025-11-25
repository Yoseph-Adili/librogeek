import {Link} from "react-router-dom";

const ListBook = ({book_title, book_info, book_id, book_cover, index}) => {
    return (
        <div
            className={"list-book-container"}
            style={{'--i': index}}
        >
            <div className="list-book-text">
                <h2><Link to={`/book/${book_id}`}>{book_title}</Link></h2>
                <p>{book_info}</p>
            </div>
            <div className="list-book-cover">
                <Link to={`/book/${book_id}`}>
                    <img src={book_cover} alt=""/>
                </Link>
            </div>
        </div>
    )
}
export default ListBook