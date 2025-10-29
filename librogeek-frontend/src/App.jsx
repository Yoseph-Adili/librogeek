import {useState} from 'react'
import './App.css'
import Navbar from "./component/navbar/nav.jsx";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/home.jsx";
import Books from "./pages/books.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";

function App() {
    let lightTheme;
    const theme=()=>{
        if (localStorage.key("theme")) {
             lightTheme = localStorage.key("theme") ? localStorage.getItem("theme") === "light" : true;
            return lightTheme;
        } else {
            const prefers=window.matchMedia("(prefers-color-scheme: light)");
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
            <Navbar></Navbar>
            <main>
                <Routes>
                   <Route path="/" element={<Home/>}></Route>
                   <Route path="/books" element={<Books/>}></Route>
                   <Route path="/about" element={<About/>}></Route>
                   <Route path="/contact" element={<Contact/>}></Route>
                </Routes>
            </main>
        </div>
    )
}

export default App
