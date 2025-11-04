import MostReadBook from "./mostReadBook.jsx";
import "./mostReadBook.css"
const MostReadSection = () => {

    return (
        <section className="most-read-section">
            <h2>Most Read Books</h2>
            <div className="most-read-books-container">
                <MostReadBook book_cover={"/book-example.png"}/>
                <MostReadBook book_cover={"/book-example.png"}/>
                <MostReadBook book_cover={"/book-example2.png"}/>
                <MostReadBook book_cover={"/book-example3.png"}/>
                <MostReadBook book_cover={"/book-example.png"}/>
            </div>
        </section>
    );
};
export default MostReadSection;