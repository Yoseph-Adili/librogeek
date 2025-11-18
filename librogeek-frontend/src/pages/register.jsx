import './css/login.css'
import Logo from "../component/logo.jsx";
import {Link} from "react-router-dom";
import {API_URL} from "../config/api.js";
import alert from "../config/utils.js";

const Register = () => {
    console.log(API_URL)

    async function registerForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const name = formData.get("name")
        const username = formData.get("username")
        const password = formData.get("password")
        const passwordConfirm = formData.get("password-confirm")
        const email = formData.get("email")

        if (name.trim() === "") {
            document.querySelector("#name").style.borderColor = "red"
            alert("name must be fulled")
            return
        }

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
        if (passwordConfirm.trim() === "") {
            document.querySelector("#password-confirm").style.borderColor = "red"
            alert("passwordConfirm must be fulled")
            return
        }
        if (password !== passwordConfirm) {
            document.querySelector("#password-confirm").style.borderColor = "red"
            alert("passwordConfirm must be same as password")
            return
        }
        if (email.trim() === "" && !validateEmail(email)) {
            document.querySelector("#email").style.borderColor = "red"
            alert("email must be correct fulled")
            return
        }

        const user = {
            name: name, username: username, password: password, confirmPassword: passwordConfirm, email: email,
        };
        // console.log(user)

        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(user),
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                window.location.href = "/"
                alert("successfully registered");
            } else {
                alert("register failed" + data.message);
            }
        } catch (err) {
            alert("internal server error" + err.message);
        }
    }

    return (


        <main className={"login-main"}>
            <div>
                <Logo className={"logo-tag"}></Logo>
                <span>ibroGeek</span>
            </div>
            <form action="" onSubmit={registerForm}>

                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name"/>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username"/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password"/>
                <label htmlFor="password-confirm">Password</label>
                <input type="password" name="password-confirm" id="password-confirm"/>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email"/>
                <button>
                    Login
                </button>

            </form>
            <div>
                <Link to={"/"}>Return to home page</Link>
                <Link to={"/login"}>Have account?</Link>
            </div>

        </main>

    );
};

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

export default Register;
