import {useState,useEffect} from 'react'
import './App.css'
import Navbar from "./component/navbar/nav.jsx";
import {Routes, Route,useLocation } from "react-router-dom";
import Home from "./pages/home.jsx";
import Books from "./pages/books.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Footer from "./component/footer/footer.jsx";
import AnimatedBackground from "./component/animatedBackground.jsx";
import Profile from "./pages/profile.jsx";

function App() {
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


    return (
        <div className={`app ${theme() ? ' light-theme' : ''}`}>
            <ScrollToTop></ScrollToTop>
            <Navbar></Navbar>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/books" element={<Books/>}></Route>
                    <Route path="/about" element={<About/>}></Route>
                    <Route path="/contact" element={<Contact/>}></Route>
                    <Route path="/profile" element={<Profile/>}></Route>
                </Routes>
            </main>
            <AnimatedBackground></AnimatedBackground>
            <Footer></Footer>

        </div>
    )
}

const ScrollToTop = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default App
