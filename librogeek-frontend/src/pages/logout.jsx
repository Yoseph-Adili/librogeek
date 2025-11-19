import {useEffect} from "react";
import './css/login.css'
import Logo from "../component/logo.jsx";
import {Link} from "react-router-dom";
import {API_URL} from "../config/api.js";

const Logout = () => {
    useEffect(() => {
        const logout = async () => {
            try {
                const res = await fetch(`${API_URL}/users/logout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                });
                const data = await res.json();
                if (res.ok && data?.success) {
                    localStorage.removeItem("token");

                    console.log("Logged out successfully");

                    window.location.href = "/"
                } else {
                    console.log("Could not logout", data);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        logout();
    }, []);


    return (

        <main className={"login-main"}>
            <main>
                <Logo className={"logo-tag"}></Logo>
                <span>ibroGeek</span>
            </main>
            <section style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h2>You have been logged out.</h2>
                <br/>
                <Link to="/" className="login-link">Return to homepage</Link>
                <br/>
                <Link to="/login" className="login-link">Login Again</Link>
            </section>


        </main>
    )
}
export default Logout;