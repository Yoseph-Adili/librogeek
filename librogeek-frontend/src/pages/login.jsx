import './css/login.css'
import Logo from "../component/logo.jsx";
import {Link} from "react-router-dom";
import alert from "../config/utils.js";
import {API_URL} from "../config/api.js";
import {useContext, useEffect} from "react";
import {UserContext} from "../App.jsx";

const Login = () => {
    const {loginUser} = useContext(UserContext);
    if (loginUser) window.location.href = "/"
    async function loginForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);


        const username = formData.get("username")
        const password = formData.get("password")


        if (username.trim() === "") {
            document.querySelector("#username").style.borderColor = "red"
            alert("username must be fulled")
            return
        }

        if (password.trim() === "") {
            document.querySelector("#password").style.borderColor = "red"
            alert("password must be fulled")
            return
        }else if(password.length < 8){
            document.querySelector("#password").style.borderColor = "red"
            alert("password must be at least 8 characters long")
            return
        }


        const user = {
            username: username, password: password,
        };
        console.log(user)

        try {
            const res = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user),
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                localStorage.setItem("token", data.data);
                window.location.href = "/"
                alert("successfully logged in");
            } else {
                alert("login failed" + data.message);
            }
        } catch (err) {
            alert("internal server error" + err.message);
        }
    }

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
    return (

        <main className={"login-main"}>
            <Link to={"/"}>
                <Logo className={"logo-tag"}></Logo>
                <span>ibroGeek</span>
            </Link>
            <form action="" onSubmit={loginForm}>

                <label htmlFor="username">User Name</label>
                <input type="text" name="username" id="username"/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password"/>

                <button>
                    Login
                </button>

            </form>
            <div>
                <Link to={"/"}>Return to home page</Link>
                <Link to={"/register"}>No account?</Link>
            </div>

        </main>

    );
};

export default Login;
