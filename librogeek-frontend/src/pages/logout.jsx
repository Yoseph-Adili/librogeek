import { useContext, useEffect } from "react";
import './css/login.css'
import Logo from "../component/logo.jsx";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api.js";
import { UserContext } from "../App.jsx";

const Logout = () => {
    const { loginUser, setLoginUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await fetch(`${API_URL}/users/logout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
            } catch (err) {
                console.error("Logout error:", err);
            } finally {
                localStorage.removeItem("token");
                setLoginUser(null);
                navigate("/", { replace: true });
            }
        };

        logout();
    }, []);

    if (!loginUser) return null;

    return (
        <main className="login-main">
            <main>
                <Logo className="logo-tag" />
                <span>ibroGeek</span>
            </main>

            <section style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2>You have been logged out.</h2>
                <br />
                <Link to="/" className="login-link">Return to homepage</Link>
                <br />
                <Link to="/login" className="login-link">Login Again</Link>
            </section>
        </main>
    );
};

export default Logout;
