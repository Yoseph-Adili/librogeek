import {Link} from "react-router-dom";
import CategoryBook from "./categoryBook.jsx";
import CustomizeTitle from "../../cuntomizeTitle.jsx";

const Category = ({category_tag, category_link}) => {
    return (
        <div className="category">
            <div className="category-books">
                <CategoryBook book_link={"/book"} book_intro={"fgdgdf"} book_title={"book"}
                              book_cover={"/book-example.png"}></CategoryBook>
                <CategoryBook book_link={"/book"} book_intro={"fgdgdf"} book_title={"book"}
                              book_cover={"/book-example.png"}></CategoryBook>
                <CategoryBook book_link={"/book"} book_intro={"fgdgdf"} book_title={"book"}
                              book_cover={"/book-example.png"}></CategoryBook>
                <CategoryBook book_link={"/book"} book_intro={"fgdgdf"} book_title={"book"}
                              book_cover={"/book-example.png"}></CategoryBook>
                <CategoryBook book_link={"/book"} book_intro={"fgdgdf"} book_title={"book"}
                              book_cover={"/book-example.png"}></CategoryBook>
                <CategoryBook book_link={"/book"} book_intro={"fgdgdf"} book_title={"book"}
                              book_cover={"/book-example.png"}></CategoryBook>


            </div>
            <div className="category-tag-container">
                <div className="category-tag">
                    <CustomizeTitle title={category_tag}></CustomizeTitle>

                    <Link to={category_link}>SEE MORE</Link>
                </div>
            </div>
        </div>
    )
}
export default Category;