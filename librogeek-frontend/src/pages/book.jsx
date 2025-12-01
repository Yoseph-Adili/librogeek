import './css/book.css'
import {Link, useParams} from "react-router-dom";
import BookInfo from "../component/book/bookInfo.jsx";
import {useEffect, useState} from "react";
import {API_URL} from "../config/api.js";
import Comment from "../component/book/comment.jsx";
import alert from "../config/utils.js";

const Book = () => {
    const {bookId} = useParams()
    const token = localStorage.getItem("token");

    if (!bookId) return (
        <div>Loading...</div>
    )
    const [book, setBook] = useState([])
    const [comments, setComments] = useState([]);
    useEffect(() => {
        fetchComments()
    }, [bookId])

    function sendComment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const comment = formData.get("new-comment");

        if (comment.trim() === "") return alert("comment must be fulled");

        fetch(`${API_URL}/books/book/comment/${bookId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: comment
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log("Comment added");
                    alert("Comment added successfully");
                    e.target.reset();
                    fetchComments()
                }
            });
    }

    function fetchComments() {
        fetch(`${API_URL}/books/book/${bookId}`, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(res => res.json())
            .then(data => {

                setBook(data.data)
                setComments(data.data.userComments)

            })
            .catch(err => console.error(err));
    }

    return (
        <div className={"book-page-container"}>
            <BookInfo book={book}></BookInfo>
            <div className="comments-container">
                <h1>Comments</h1>

                <form className="new-comment-container" onSubmit={sendComment}>
                    <textarea placeholder="Write your comment here..." className={"new-comment-textarea"}
                              name={"new-comment"} required/>
                    <button type={"submit"}>Send</button>
                </form>
                {comments?.map((c, i) => (
                    <Comment key={c.comment_id ?? i} comment={c}/>
                ))}


            </div>
        </div>
    )
}
export default Book