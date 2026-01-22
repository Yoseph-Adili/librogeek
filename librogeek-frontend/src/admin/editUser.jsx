import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {API_URL, STATIC_URL} from "../config/api.js";
import {UserContext} from "../App.jsx";
import "./editUser.css"


const EditUser = () => {
    const {userId} = useParams();
    const token = localStorage.getItem("token") || null;
    const [userImage, setUserImage] = useState(STATIC_URL + "/profile/unknown.jpg");
    const [user, setUser] = useState([])
    const {loginUser} = useContext(UserContext);
    useEffect(() => {

        if (!loginUser || loginUser.role !== "ADMIN") return;
        fetch(`${API_URL}/users/editUser/${userId}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUser(data.data);
                    if (data.data.profile_photo) {
                        setUserImage(STATIC_URL +"/"  +data.data.profile_photo)
                    }

                }
            });


    }, [loginUser]);
    function handleChange(e) {
        const {name, value} = e.target;
        setUser(prev => ({...prev, [name]: value}));
    }
    return (
        <div className={"edit-user-page-container"}>

            <div className="user-info-container">
                <div className="profile-photo">
                    <img src={userImage} alt="profile"/>
                </div>
                <form className="user-info">
                    <input type={"text"} name={"name"} value={user.name} id={"editUserName"} onChange={handleChange}/>
                    <h2>{user.name}</h2>
                    <input type={"text"} name={"username"} value={user.username} id={"editUserUsername"}/>
                    <p>@{user.username}</p>
                    {user.email && (
                        <input type="email" name="email" value={user.email} id="editUserUsername" />
                    )}


                    <p>{user.email}</p>
                    <button className={"save-user-info-btn"}>Save</button>
                </form>
            </div>
            <p>Address</p>
        </div>
    );
}
export default EditUser;