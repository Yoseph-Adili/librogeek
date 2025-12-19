import './css/profile.css'
import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import {API_URL, STATIC_URL} from "../config/api.js";
import Book from "../component/profile/book.jsx";
import Comments from "../component/profile/Comments.jsx";


const Profile = () => {
    const [showOption, setShowOption] = useState("Bookshelf")
    const {loginUser} = useContext(UserContext);
    const token = localStorage.getItem("token") || null;
    const [bookShelfBooks, setBookShelfBooks] = useState([])
    const [historyBooks, setHistoryBooks] = useState([])
    const [myComment, setMyComment] = useState([])
    const [purchasedBooks, setPurchasedBooks] = useState([])
    useEffect(() => {
        if (loginUser === null) {

            window.location.href = "/";
        }
    }, [loginUser]);

    if (!loginUser) {
        return <div className="profile-page-container">Loading...</div>;
    }
    useEffect(() => {
        fetch(`${API_URL}/books/userBookShelf`, {
            method: "GET", headers: {
                Authorization: `Bearer ${token}`, "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log(data)
                    setBookShelfBooks(data.data)
                }
            });
        fetch(`${API_URL}/books/userHistory`, {
            method: "GET", headers: {
                Authorization: `Bearer ${token}`, "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setHistoryBooks(data.data)
                }
            });
        fetch(`${API_URL}/books/book/userComments`, {
            method: "GET", headers: {
                Authorization: `Bearer ${token}`, "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMyComment(data.data)
                    console.log(data)
                }
            });
        fetch(`${API_URL}/shipping/userPurchased`, {
            method: "GET", headers: {
                Authorization: `Bearer ${token}`, "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPurchasedBooks(data.data)
                    console.log(data)
                }
            });

    }, []);

    let profile_photo = loginUser.profile_photo != null ? loginUser.profile_photo : "profile/unknown.jpg";

    let userImage = STATIC_URL + "/" + profile_photo;
    return (<div className={"profile-page-container"}>
        <div className="user-info-container">
            <div className="profile-photo">
                <img src={userImage} alt="profile"/>
            </div>
            <div className="user-info">
                <h2>{loginUser.name}</h2>
                <p>@{loginUser.username}</p>
                <p>{loginUser.email}</p>
                <Link to={"/setting"}>Edit Profile Info</Link>
            </div>
        </div>

        <div className="user-save-option-container">
            <span
                className={`${showOption === "Bookshelf" ? "active" : ""}`}
                onClick={() => setShowOption("Bookshelf")}
            >Bookshelf</span>
            <span
                className={`${showOption === "History" ? "active" : ""}`}
                onClick={() => setShowOption("History")}
            >History</span>
            <span
                className={`${showOption === "Comments" ? "active" : ""}`}
                onClick={() => setShowOption("Comments")}
            >Comments</span>
            {purchasedBooks.length > 0 ?
            <span
                className={`${showOption === "Purchased" ? "active" : ""}`}
                onClick={() => setShowOption("Purchased")}
            >Purchased</span>
                : null}

        </div>
        <div className="user-save-container">
            <p>
                {showOption}
            </p>
            <div className="user-saves">
                <div
                    className={`${showOption === "Bookshelf" ? "active" : ""}`}
                    onClick={() => setShowOption("Bookshelf")}
                >


                    {bookShelfBooks.map((option, index) => (
                        <Book key={option.bookId} book={option} index={index}/>
                    ))}


                </div>
                <div
                    className={`${showOption === "History" ? "active" : ""}`}
                    onClick={() => setShowOption("History")}
                >
                    {historyBooks.map((option, index) => (
                        <Book key={option.bookId} book={option} index={index}/>
                    ))}

                </div>
                <div
                    className={`${showOption === "Comments" ? "active" : ""}`}
                    onClick={() => setShowOption("Comments")}
                >
                    {myComment.map((option, index) => (
                        <Comments key={option.bookId} book={option} index={index}/>
                    ))}
                </div>
                {purchasedBooks.length > 0 ?
                    <div
                        className={`${showOption === "Purchased" ? "active" : ""}`}
                        onClick={() => setShowOption("Purchased")}
                    >
                        {purchasedBooks.map((option, index) => (
                            <Book key={option.bookId} book={option} index={index}/>
                        ))}
                    </div>
                    : null}
            </div>
        </div>


    </div>)
}
export default Profile