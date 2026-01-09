import {useState, useEffect, createContext} from 'react'
import './App.css'

import {Routes, Route, useLocation} from "react-router-dom";
import Home from "./pages/home.jsx";
import Books from "./pages/books.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";

import Profile from "./pages/profile.jsx";
import Book from "./pages/book.jsx";
import Login from "./pages/login.jsx";
import MainLayout from "./layout/mainLayout.jsx";
import Register from "./pages/register.jsx";
import {API_URL} from "./config/api.js";
import Logout from "./pages/logout.jsx";
import Setting from "./pages/setting.jsx";
import Pdf from "./pages/pdf.jsx";
import ForgetPassword from "./pages/forgetPassword.jsx";
import Order from "./pages/order.jsx";
import AdminLayout from "./layout/adminLayout.jsx";
import AdminBooks from "./admin/adminBooks.jsx";
import Earning from "./admin/earning.jsx";
import Orders from "./admin/orders.jsx";
import Users from "./admin/users.jsx";


const UserContext = createContext();

function App() {
    const [loginUser, setLoginUser] = useState(undefined);
    let lightTheme;
    const theme = () => {
        if (localStorage.key("theme")) {
            lightTheme = localStorage.key("theme") ? localStorage.getItem("theme") === "light" : true;
            return lightTheme;
        } else {
            const prefers = window.matchMedia("(prefers-color-scheme: light)");
            if (prefers.matches) {
                lightTheme = true;
            } else {
                lightTheme = false;
            }
            return lightTheme;
        }
    }
    useEffect(() => {
        const refreshToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            try {
                const res = await fetch(`${API_URL}/users/refresh`, {
                    method: "POST",
                    headers: { Authorization: "Bearer " + token }
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem("token", data.data);
                    console.log("Token refreshed");
                } else {
                    console.warn("Refresh failed:", res.status);
                }
            } catch (err) {
                console.error("Refresh error:", err);
            }
        };

        refreshToken();

        const interval = setInterval(refreshToken, 14 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${API_URL}/users/status`, {
            credentials: "include",
            headers: { Authorization: "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => setLoginUser(data?.success ? data.data : null))
            .catch(() => setLoginUser(null));
    }, []);

    return (
        <UserContext.Provider value={{loginUser, setLoginUser}}>
            <div className={`app ${theme() ? ' light-theme' : ''}`}>
                <ScrollToTop/>
                <Routes>

                    <Route element={<MainLayout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/books" element={<Books/>}/>
                        <Route path="/books/category/:category" element={<Books />} />
                        <Route path="/book/:bookId" element={<Book/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/setting" element={<Setting/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/profile/:id" element={<Profile/>}/>
                        <Route path="/order" element={<Order/>}/>
                    </Route>


                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<AdminBooks/>}/>
                        <Route path="/admin/books" element={<AdminBooks/>}/>
                        <Route path="/admin/books/category/:category" element={<AdminBooks />} />
                        <Route path="/admin/earning" element={<Earning/>}/>
                        <Route path="/admin/orders" element={<Orders/>}/>
                        <Route path="/admin/users" element={<Users/>}/>
                    </Route>



                    <Route path="/book/pdf/:bookId" element={<Pdf/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/forgetPassword" element={<ForgetPassword/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                </Routes>

            </div>
        </UserContext.Provider>
    )
}

const ScrollToTop = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        const background = document.querySelector(".app");
        background.style.removeProperty("--background-color",)
        background.style.removeProperty("--text-color",)
    }, [pathname]);

    return null;
}
export { UserContext };
export default App
