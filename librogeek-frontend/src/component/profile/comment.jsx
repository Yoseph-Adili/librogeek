import {STATIC_URL} from "../../config/api.js";
import {useContext} from "react";
import {UserContext} from "../../App.jsx";

const Comment = ({comment}) => {
    const {loginUser} = useContext(UserContext);

    return (
        <div className={"comment-container"}>
            <div className={"comment-user-profile"}>
                <img src={STATIC_URL + "/" + loginUser.profile_photo} alt=""/>
            </div>
            <div className={"comment-info"}>

                <h3>{loginUser.name}</h3>
                <h5>@{loginUser.username}</h5>
                <p>{comment.comment}</p>
            </div>
            <div className={"time-container"}>
                <p>{comment.createdAt}</p>
            </div>
        </div>
    )
}
export default Comment