import {useMatch, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";

const AnimatedBackground = () => {
    const [page, setPage] = useState("")

    const location = useLocation();
    const matchCategory = useMatch("/books/category/:category");
    useEffect(() => {
        const path = location.pathname;
        if (path === "/" || path === "/home") {
            setPage("home");
        } else if (path === "/books") {
            setPage("books");
        } else if (matchCategory) {
            setPage("books");
        } else if (path === "/about") {
            setPage("about");
        } else if (path === "/contact") {
            setPage("contact");
        } else if (path === "/profile") {
            setPage("profile");
        } else if (path === "/order") {
            setPage("order");
        } else {
            setPage("");
        }
    }, [location]);

    return (<div className={`animated-background ${page}`}>
    </div>)
}

export default AnimatedBackground