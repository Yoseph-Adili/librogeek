import {Link} from "react-router-dom";
import CategoryBook from "./categoryBook.jsx";
import CustomizeTitle from "../../cuntomizeTitle.jsx";

const Category = (books) => {

    const books_list = books.books;


    return (
        <div className="category">
            <div className="category-books">

                {books_list?.map((b, i) => (
                    <CategoryBook key={i} book_link={`/book/${b.book_id}`} book_intro={b.description} book_title={b.title}
                              book_cover={b.cover_image}></CategoryBook>
                ))}

            </div>
            <div className="category-tag-container">
                <div className="category-tag">
                    <CustomizeTitle title={books_list[0].category}></CustomizeTitle>
                    <Link to={`/books/category/${books_list[0].category}`}>SEE MORE</Link>
                </div>
            </div>
        </div>
    )
}
export default Category;