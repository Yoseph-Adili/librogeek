import './css/profile.css'
import {Link} from "react-router-dom";
import {useState} from "react";

const Profile = () => {
    const [showOption, setShowOption] = useState("Bookshelf")
    return (<div className={"profile-page-container"}>
        <div className="user-info-container">
            <div className="profile-photo">
                <img src="/book-example.png" alt=""/>
            </div>
            <div className="user-info">
                <h2>name</h2>
                <p>@userName</p>
                <p>email@mail.com</p>
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
                    Bookshelf
                </div>
                <div
                    className={`${showOption === "History" ? "active" : ""}`}
                    onClick={() => setShowOption("History")}
                >
                    History
                </div>
                <div
                    className={`${showOption === "Comments" ? "active" : ""}`}
                    onClick={() => setShowOption("Comments")}
                >
                    Comments
                </div>
            </div>
        </div>


    </div>)
}
export default Profile