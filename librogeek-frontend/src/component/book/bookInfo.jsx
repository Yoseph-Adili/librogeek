import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {API_URL, STATIC_URL} from "../../config/api.js";
import alert from "../../config/utils.js";

const BookInfo = ({book}) => {

    const [bookInBookshelf, setBookInBookshelf] = useState(book.inBookShelf || false)
    const [tagSelected, setTagSelected] = useState(false)
    const [tagId, setTagId] = useState(null)
    const tags = book.tags || [];
    console.log(tags)
    useEffect(() => {
        setBookInBookshelf(book.inBookShelf)
    }, [book])

    function addToBookshelf() {
        const token = localStorage.getItem("token");
        fetch(`${API_URL}/books/book/bookshelf/${book.book_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    setBookInBookshelf(prev => !prev);
                }
            })
    }
    function updateTagVotes(trueOrFalse) {
        let vote = trueOrFalse ? "add" : "subtract";
        const token = localStorage.getItem("token");

        fetch(`${API_URL}/books/book/tag/${vote}/${tagId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.reload()
                    alert(data.message)

                }
            })
    }


    return (<div className="book-info-container">
        <div className="book-cover">

            <img src={STATIC_URL + "/" + book.cover_image} alt=""/>
        </div>
        <div className="book-info">
            <h1>{book.title}</h1>
            <a href="">{book.author}</a>
            <p>{book.description}</p>
            <div style={{'--i': 2}} className="type-container">

                <div className="type">
                    <p>Category</p>


                    <Link to={`/books/category/${book.category}`}>{book.category}</Link>

                </div>
                <div className="type">
                    <p>Type</p>

                    <Link to={"4"}>{book.book_type}</Link>

                </div>
            </div>
            <div style={{'--i': 2}} className="tag-container">
                <p>Tag</p>
                <div className="tag-options">

                    {tags.map((option, index) => (
                        <sapn key={index}
                              className={`tag-option ${tagSelected && tagId === option.tag_id ? "selected" : ""}`}
                              onClick={() => {
                                  if (tagSelected && tagId === option.tag_id) {
                                      setTagSelected(prev => !prev)
                                  } else {
                                      setTagSelected(true)
                                  }
                                  setTagId(option.tag_id)
                              }}>
                            {option.tag}
                        </sapn>))}
                    <span className={"add-options"}>+</span>
                </div>
                <div style={tagSelected ? { height: "30px"} : {height: "0px"}} className={"tag-vote-container"}>

                    <span className={"tag-vote"} onClick={()=>{updateTagVotes(true)}}>vote +1</span>
                    <span className={"tag-vote"} onClick={()=>{updateTagVotes(false)}}>vote -1</span>
                </div>
            </div>
            <div className="price-container"></div>
            <div className={"buttons-container"}>

                <span className={"read-book-btn"}>Read</span>
                <span className={"add-to-bookshelf-btn"} onClick={() => addToBookshelf()}>

<svg viewBox="0 0 491 686" fill={bookInBookshelf ? "var(--text-color)" : "none"} xmlns="http://www.w3.org/2000/svg">
<path d="M465.5 25H25V625L242 467.5L465.5 635.5V25Z" stroke="var(--text-color)" strokeWidth="50"/>
</svg>

                    </span>
            </div>
        </div>
    </div>)
}
export default BookInfo