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
                    setLoginUser(data.data);
                } else {
                    setLoginUser(null);
                    console.log("User not logged in");
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
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
