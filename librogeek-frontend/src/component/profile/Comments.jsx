import {Link} from "react-router-dom";
import {STATIC_URL} from "../../config/api.js";
import Comment from "./comment.jsx";

const Comments = ({book, index}) => {
    console.log(book)

    return (

        <div
            className={"profile-comments-container"}
            style={{'--i': index}}
        >
            <div className={"profile-comments-book"}>


                <div className="profile-comments-book-cover">
                    <Link to={`/book/${book.book_id}`}>
                        <img src={STATIC_URL + "/" + book.cover_image} alt=""/>
                    </Link>
                </div>
                <div className="profile-comments-book-text">
                    <h2><Link to={`/book/${book.book_id}`}>{book.title}</Link></h2>
                    <p>{book.description}</p>
                    <div className={"tags"}>
                        {book.tags.map((option, index) => (
                            <span key={index} className={"tag"}>{option.tag}</span>
                        ))}
                    </div>
                </div>
            </div>
                {
                    book.comments?.map((c, i) => (
                        <Comment key={c.comment_id ?? i} comment={c}/>
                    ))
                }


        </div>

    )
}
export default Comments