import {Link} from "react-router-dom";

const BookInfo=()=>{
    const tags = ['All', 'PDF', 'E-Book']
    const category = "gfd"
    const type = "PDF"
    return (
        <div className="book-info-container">
            <div className="book-cover">
                <img src="/book-example.png" alt=""/>
            </div>
            <div className="book-info">
                <h1>book title</h1>
                <a href="">aithor name</a>
                <p>Pay 50% less for your Statement of Work (SoW) and exchange it for 2x equity in an MFN SAFE.</p>
                <div style={{'--i': 2}} className="type-container">

                    <div className="type">
                        <p>Category</p>


                        <Link to={"4"}>{category}</Link>

                    </div>
                    <div className="type">
                        <p>Type</p>

                        <Link to={"4"}>{type}</Link>

                    </div>
                </div>
                <div style={{'--i': 2}} className="tag-container">
                    <p>Tag</p>
                    <div className="tag-options">

                        {
                            tags.map((option, index) => (
                                <Link to={"4"} key={index}
                                      className={option === "All" ? "selected" : ""}>{option}</Link>
                            ))
                        }
                    </div>
                </div>
                <span className={"add-to-bookshelf"}>Add To Bookshelf</span>
            </div>
        </div>
    )
}
export default BookInfo