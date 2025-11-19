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


const UserContext = createContext();

function App() {
    const [loginUser, setLoginUser] = useState(null);
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
    const fetchWithRefresh = async (url, options = {}) => {
        try {
            let res = await fetch(url, options);


            if (res.status === 401) {
                const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                });
                if (refreshRes.ok) {
                    const newData = await refreshRes.json();
                    const newToken = newData.data;
                    localStorage.setItem("token", newToken);


                    res = await fetch(url, {
                        ...options,
                        headers: { ...options.headers, Authorization: "Bearer " + newToken }
                    });
                }
            }

            if (res.ok) return res.json();
            else {
                const errData = await res.json().catch(() => null);
                return { success: false, error: errData };
            }

        } catch (err) {
            console.error("Fetch error:", err);
            return { success: false, error: err };
        }
    };

    useEffect(() => {
        fetchWithRefresh(`${API_URL}/users/status`, {
            credentials: "include",
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        }).then(data => {
            if (data?.success) setLoginUser(data.data);
            else setLoginUser(null);
        });
    }, []);


    return (
        <UserContext.Provider value={{loginUser, setLoginUser}}>
            <div className={`app ${theme() ? ' light-theme' : ''}`}>
                <ScrollToTop/>
                <Routes>

                    <Route element={<MainLayout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/books" element={<Books/>}/>
                        <Route path="/books/:bookId" element={<Book/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/profile/:id" element={<Profile/>}/>
                    </Route>


                    <Route path="/login" element={<Login/>}/>
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
