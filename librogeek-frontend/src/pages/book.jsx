import './css/book.css'
import category from "../component/home/categorieSection/category.jsx";
import {Link} from "react-router-dom";
import BookInfo from "../component/book/bookInfo.jsx";

const Book = () => {

    return (
        <div className={"book-page-container"}>
            <BookInfo></BookInfo>
            <div className="chapter-container">
                <p>Chapters</p>
            </div>
        </div>
    )
}
export default Book