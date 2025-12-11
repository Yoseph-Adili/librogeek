import './css/login.css'
import Logo from "../component/logo.jsx";
import {Link} from "react-router-dom";
import alert from "../config/utils.js";
import {API_URL} from "../config/api.js";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";

const ForgetPassword = () => {
    const {loginUser} = useContext(UserContext);
    if (loginUser) window.location.href = "/"

    const [emailSent,setEmailSent]=useState(false)

    useEffect(() => {
        fetch(`${API_URL}/users/status`,
            {
                credentials: "include",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then(async res => {
                console.log("HTTP status:", res.status);
                if (res.ok) return res.json();
                else {
                    const errData = await res.json().catch(() => null);
                    console.log("Error response:", errData);
                    return null;
                }
            })
            .then(data => {
                if (data?.success) {
                    console.log("User logged in:", data.data);
                    setUser(data.data);
                } else {
                    setUser(null);
                    console.log("User not logged in");
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
            });




    }, []);

    function sendVerificationCodeToEmail(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get("email");
        if (email.trim() === "") {
            document.querySelector("#email").style.borderColor = "red"
            alert("email be fulled")
            return
        }

        fetch(`${API_URL}/users/loginUserByEmail?email=${email}`, {
            method: "GET",
        })
            .then(res => res.json())
            .then(data => {
                setEmailSent(true)
                if (data.success) {
                    alert("email sent successfully, please check your email for the verification code")
                    document.querySelector("#email").value = "";
                } else alert("failed to change " + data.message)
            })
            .catch(err => {
                alert("internal server error" + err.message)
            })
    }
    function verificationCode(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const code = formData.get("code");
        const password=formData.get("password")


        fetch(`${API_URL}/users/loginUserByEmailVerify?code=${code}&password=${password}`, {
            method: "PATCH"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "/login"
                } else alert("failed to change " + data.message)
            })
            .catch(err => {
                alert("internal server error" + err.message)
            })
    }
    return (

        <main className={"login-main"}>
            <Link to={"/"}>
                <Logo className={"logo-tag"}></Logo>
                <span>ibroGeek</span>
            </Link>
            {emailSent ?
                <form action="" onSubmit={verificationCode}>

                    <label htmlFor="code">Verify Code</label>
                    <input type="text" name="code" id="code"/>
                    <label htmlFor="password">New Password</label>
                    <input type="password" name="password" id="password"/>
                    <p>you verification code has been sent, please check your email for the verification code</p>
                    <div className={"login-container"}>
                        <Link to={"/login"}>Remember password?</Link>
                        <button>
                            Login
                        </button>
                    </div>
                </form>


            :
            <form action="" onSubmit={sendVerificationCodeToEmail}>

                <label htmlFor="emial">Verify Email</label>
                <input type="email" name="email" id="email"/>
                <div className={"login-container"}>
                <Link to={"/login"}>Remember password?</Link>
                <button>
                    Login
                </button>
                </div>
            </form>
            }
    <div>
        <Link to={"/"}>Return to home page</Link>
        <Link to={"/register"}>No account?</Link>
    </div>
        </main>

    );
};

export default ForgetPassword;
