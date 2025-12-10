import {Link} from "react-router-dom";
import {STATIC_URL} from "../../config/api.js";

const ListBook = ({book_title, book_info, book_id, book_cover, tags , index}) => {

    return (
        <div
            className={"list-book-container"}
            style={{'--i': index}}
        >
            <div className="list-book-text">
                <h2><Link to={`/book/${book_id}`}>{book_title}</Link></h2>
                <p>{book_info}</p>
                <div className={"tags"}>
                    {tags.map((option, index) => (
                        <span key={index} className={"tag"}>{option.tag}</span>
                    ))}
                </div>
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