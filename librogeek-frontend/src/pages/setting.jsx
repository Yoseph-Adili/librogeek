import './css/setting.css'
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import {API_URL, STATIC_URL} from "../config/api.js";
import alert from "../config/utils.js";
import ImageCropper from "../component/setting/ImageCropper.jsx";

const Setting = () => {
    const loginUser = useContext(UserContext).loginUser;

    useEffect(() => {
        if (loginUser === null) {

            window.location.href = "/";
        }
    }, [loginUser]);

    if (!loginUser) {
        return <div className="profile-page-container">Loading...</div>;
    }
    let profile_photo = loginUser.profile_photo != null ? loginUser.profile_photo : "profile/unknown.jpg";
    const [userImage,setUserImage] = useState(STATIC_URL + "/" + profile_photo);
    const [newUserImage, setNewUserImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);


    console.log(loginUser.name)
    const token = localStorage.getItem("token");

    function selectPhoto(e) {

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            setNewUserImage(e.target.result);

        };
        reader.readAsDataURL(file);
        console.log(file)
    }

    async function uploadCroppedPhoto() {
        if (!croppedImage) return alert("No cropped image");

        const blob = await fetch(croppedImage).then(r => r.blob());

        const formData = new FormData();
        formData.append("imageFile", blob, "profile.jpg");

        fetch(`${API_URL}/users/uploadPhoto/${loginUser.user_id}`, {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`},
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("success");
                    window.location.reload();
                } else {
                    alert("failed " + data.message);
                }
            })
            .catch(err => alert("error: " + err.message));
    }

    function changeNameAndUsername(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const username = formData.get("username");
        if (username.trim() === "") {
            document.querySelector("#username").style.borderColor = "red"
            alert("username must be fulled")
            return
        }
        fetch(`${API_URL}/users/changeUserNames/${loginUser.user_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({name: name, username: username}),
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("successfully changed")
                    window.location.reload()
                } else alert("failed to change " + data.message)
            })
            .catch(err => {
                alert("internal server error" + err.message)
            })
    }

    function changePassword(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get("old_password");
        const newPassword = formData.get("new_password");
        const confirmPassword = formData.get("password_confirm");
        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }
        if (newPassword.length < 8) {
            alert("New password must be at least 8 characters long");
            return;
        }
        if (password.trim() === "") {
            document.querySelector("#old_password").style.borderColor = "red"
            alert("password must be fulled")
            return
        }
        if (newPassword.trim() === "") {
            document.querySelector("#new_password").style.borderColor = "red"
            alert("password must be fulled")
            return
        }
        if (confirmPassword.trim() === "") {
            document.querySelector("#password_confirm").style.borderColor = "red"
            alert("password must be fulled")
            return
        }
        fetch(`${API_URL}/users/changeUserPassword/${loginUser.user_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                password: password, newPassword: newPassword,
                confirmPassword: confirmPassword
            }),
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("successfully changed")
                    window.location.reload()
                } else alert("failed to change " + data.message)
            })
            .catch(err => {
                alert("internal server error" + err.message)
            })
    }

    return (<div className={"setting-page"}>
        <div className="image-cropper-container" style={{display: newUserImage && !croppedImage ? "flex" : "none"}}>
            <ImageCropper
                imageSrc={newUserImage}

                onDone={(img) => {
                    setCroppedImage(img);
                    setUserImage(img);
                    setNewUserImage(null);
                }}
            />
        </div>


        <section className="profile-photo-container">
            <div className="setting-profile-photo">

                <input type="file" name={"profile_photo"} id={"profile_photo"} onChange={selectPhoto}
                       style={{display: "none"}}/>
                <label htmlFor="profile_photo">
                    <svg viewBox="0 0 512 512" version="1.1" xmlSpace="preserve"
                         xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">

                        <g id="Layer_1"/>

                        <g id="Layer_2">

                            <g>

                                <g>

                                    <path className="st0"
                                          d="M307.81,212.18c-3.24,0-6.07-2.17-6.91-5.3l-4.82-17.88c-0.84-3.12-3.68-5.3-6.91-5.3h-21.46h-25.44H220.8     c-3.24,0-6.07,2.17-6.91,5.3l-4.82,17.88c-0.84,3.12-3.68,5.3-6.91,5.3H169.5c-3.96,0-7.16,3.21-7.16,7.16v101.78     c0,3.96,3.21,7.16,7.16,7.16h170.95c3.96,0,7.16-3.21,7.16-7.16V219.35c0-3.96-3.21-7.16-7.16-7.16H307.81z M282.33,264.94     c-0.86,13.64-11.93,24.71-25.58,25.58c-16.54,1.05-30.18-12.59-29.14-29.14c0.86-13.64,11.93-24.71,25.58-25.58     C269.74,234.76,283.38,248.4,282.33,264.94z"/>

                                </g>

                                <g>

                                    <path className="st0"
                                          d="M82.95,272.41c3.82,0,7.53-1.53,10.23-4.23l21.23-21.23c4.74-4.74,6.4-11.92,3.73-18.06     c-2.73-6.29-8.88-8.95-18.84-7.57l-0.27,0.27c15.78-71.56,79.7-125.27,155.94-125.27c60.72,0,115.41,33.72,142.73,87.99     c3.58,7.11,12.24,9.97,19.34,6.39c7.11-3.58,9.97-12.24,6.39-19.34c-15.47-30.73-39.05-56.66-68.22-75.01     C325.23,77.47,290.57,67.5,254.98,67.5c-93,0-170.48,67.71-185.75,156.41c-5.38-4.77-13.59-5.18-19.13-0.44     c-6.3,5.39-6.75,14.88-1.13,20.84c0.23,0.24,5.69,6.03,11.41,11.93c3.41,3.51,6.2,6.33,8.3,8.38c4.23,4.13,7.88,7.69,14.07,7.78     C82.81,272.41,82.88,272.41,82.95,272.41z"/>

                                </g>

                                <g>

                                    <path className="st0"
                                          d="M464.28,247.82l-26.5-26.5c-2.75-2.75-6.57-4.3-10.44-4.23c-2.33,0.03-4.29,0.56-6.07,1.42     c-0.26,0.12-0.51,0.26-0.76,0.4c-0.04,0.02-0.08,0.04-0.12,0.06c-0.59,0.33-1.16,0.68-1.69,1.08c-1.88,1.34-3.6,3.03-5.44,4.82     c-2.1,2.05-4.89,4.87-8.3,8.38c-5.72,5.9-11.18,11.68-11.41,11.93c-5.46,5.79-5.19,14.91,0.6,20.36     c5.75,5.42,14.77,5.18,20.24-0.48c-4.72,83.85-74.42,150.62-159.43,150.62c-70.52,0-131.86-45.23-152.62-112.55     c-2.35-7.6-10.41-11.86-18.01-9.52c-7.6,2.34-11.86,10.41-9.52,18.01c11.62,37.68,35.48,71.52,67.19,95.28     c32.8,24.59,71.86,37.58,112.96,37.58c100.11,0,182.23-78.45,188.14-177.1l0.79,0.79c2.81,2.81,6.5,4.22,10.18,4.22     c3.69,0,7.37-1.41,10.18-4.22C469.91,262.57,469.91,253.45,464.28,247.82z"/>

                                </g>

                            </g>

                        </g>

                    </svg>
                </label>


                <img src={userImage} alt="profile"/>
            </div>
            <div>
                {croppedImage && (
                    <span className={"profile-delete"} onClick={uploadCroppedPhoto}>Upload</span>
                )}
                <span className={"profile-delete"}>
                    Dlete Profile
                </span>
            </div>
        </section>
        <section>
            <form action="" onSubmit={changeNameAndUsername}>
                <label htmlFor="name">Name</label>
                <input type="text" name={"name"} id={"name"} defaultValue={loginUser.name}/>
                <label htmlFor="username">Username</label>
                <input type="text" name={"username"} id={"username"} defaultValue={loginUser.username}/>
                <button>Change</button>
            </form>
        </section>
        <section>
            <form action="">
                <label htmlFor="email">New Email</label>
                <input type="email" name={"email"} id={"email"}/>
                <button>Send verification Code</button>
            </form>
        </section>
        <section>
            <form action="" onSubmit={changePassword}>
                <label htmlFor="old_password">Old Password</label>
                <input type="old_password" name={"old_password"} id={"old_password"}/>

                <label htmlFor="new_password">New Password</label>
                <input type="password" name={"new_password"} id={"new_password"}/>
                <label htmlFor="password_confirm">New Password Confirm</label>
                <input type="password" name={"password_confirm"} id={"password_confirm"}/>
                <button>Change</button>
            </form>
        </section>
        <section>
            <form action="">
                <label htmlFor="">Delete Account</label>
                <button>Delete</button>
            </form>
        </section>
    </div>)
}
export default Setting