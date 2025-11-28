import './css/book.css'
import category from "../component/home/categorieSection/category.jsx";
import {Link, useParams} from "react-router-dom";
import BookInfo from "../component/book/bookInfo.jsx";
import {useEffect, useState} from "react";
import {API_URL} from "../config/api.js";
import Comment from "../component/book/comment.jsx";

const Book = () => {
    const {bookId} = useParams()
    const token = localStorage.getItem("token");

    if (!bookId) return (
        <div>Loading...</div>
    )
    const [book, setBook] = useState([])
    const [comments, setComments] = useState([]);
    useEffect(() => {
        fetch(`${API_URL}/books/book/${bookId}`,{
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(res => res.json())
            .then(data => {

                setBook(data.data)
                setComments(data.data.userComments);
            })
            .catch(err => console.error(err))

        

    }, [bookId])
    // setComments(book.userComments);

    return (
        <div className={"book-page-container"}>
            <BookInfo book={book}></BookInfo>
            <div className="comments-container">
                <h1>Comments</h1>

                <div className="new-comment-container">

                </div>
                {comments?.map((c, i) => (
                    <Comment key={c.comment_id ?? i} comment={c}/>
                ))}


            </div>
        </div>
    )
}
export default Book