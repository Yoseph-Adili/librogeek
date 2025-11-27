import {STATIC_URL} from "../../config/api.js";

const Comment = ({comment}) => {
    return (
        <div className={"comment-container"}>
            <div className={"comment-user-profile"}>
                <img src={STATIC_URL + "/" + comment.profile_photo} alt=""/>
            </div>
            <div className={"comment-info"}>

                <h3>{comment.name}</h3>
                <h5>@{comment.username}</h5>
                <p>{comment.comment}</p>
            </div>
            <div className={"time-container"}>
                <p>{comment.createdAt}</p>
            </div>
        </div>
    )
}
export default Comment