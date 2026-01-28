import './css/login.css'
import Logo from "../component/logo.jsx";
import { Link, useNavigate } from "react-router-dom";
import alert from "../config/utils.js";
import { API_URL } from "../config/api.js";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App.jsx";

const Login = () => {
    const { loginUser, setLoginUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch(`${API_URL}/users/status`, {
            credentials: "include",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.success) {
                    setLoginUser(data.data);
                    navigate("/", { replace: true });
                }
            })
            .catch(() => {});
    }, []);

    async function loginForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username")?.trim();
        const password = formData.get("password")?.trim();

        const newErrors = {};

        if (!username) newErrors.username = true;
        if (!password) newErrors.password = true;
        else if (password.length < 8) newErrors.password = "len";

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            alert("Please fix the form errors");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.data);
                setLoginUser(data.user || true);
                alert("Successfully logged in");
                navigate(-1);
            } else {
                alert(data.message || "Login failed");
            }
        } catch (err) {
            alert("Server error: " + err.message);
        }
    }

    if (loginUser) return null;

    return (
        <main className="login-main">
            <Link to="/">
                <Logo className="logo-tag" />
                <span>ibroGeek</span>
            </Link>

            <form onSubmit={loginForm}>
                <label htmlFor="username">User Name</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className={errors.username ? "input-error" : ""}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className={errors.password ? "input-error" : ""}
                />

                <div className="login-container">
                    <Link to="/forgetPassword">Forget password?</Link>
                    <button type="submit">Login</button>
                </div>
            </form>

            <div>
                <Link to="/">Return to home page</Link>
                <Link to="/register">No account?</Link>
            </div>
        </main>
    );
};

export default Login;
