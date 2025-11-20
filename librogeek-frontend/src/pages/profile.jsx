import './css/profile.css'
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import {UserContext} from "../App.jsx";
import {STATIC_URL} from "../config/api.js";

const Profile = () => {
    const [showOption, setShowOption] = useState("Bookshelf")
    const {loginUser} = useContext(UserContext);
    if (!loginUser) window.location.href = "/"

    if (!loginUser) {
        return <div className="profile-page-container">Loading...</div>;
    }

    let profile_photo = loginUser.profile_photo != null ? loginUser.profile_photo : "profile/unknown.png";

    let userImage = STATIC_URL + "/" + profile_photo;
    return (<div className={"profile-page-container"}>
        <div className="user-info-container">
            <div className="profile-photo">
                <img src={userImage} alt=""/>
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