import {Link} from "react-router-dom";

const ListBook = ({book_title, book_info, book_link, book_cover, index}) => {
    return (
        <div
            className={"list-book-container"}
            style={{'--i': index}}
        >
            <div className="list-book-text">
                <h2><Link to={book_link}>{book_title}</Link></h2>
                <p>{book_info}</p>
            </div>
            <div className="list-book-cover">
                <Link to={book_link}>
                    <img src={book_cover} alt=""/>
                </Link>
            </div>
        </div>
    )
}
export default ListBook