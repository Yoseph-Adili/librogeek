import './navbar.css';
import {Link, useMatch, useResolvedPath} from "react-router-dom";
import LogoContainer from "./logoContainer.jsx";
import ChangeThemeContainer from "./changeThemeContainer.jsx";
import {useEffect, useState} from "react";

const Navbar = () => {
    const [isActive, setActive] = useState(true)
    const defaultActive = isActive;
    const timer = setTimeout(() => {
        setActive(false)
    }, 0);
    clearTimeout(timer);
    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 0) {
                setActive(true);
            } else {
                setActive(false);
            }
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    function HoverNavbar(trueOrFalse) {
        if (trueOrFalse&& window.scrollY !== 0) {

            setActive(true)

        }else {

            setActive(false)
        }
    }
    return (
        <header  onMouseEnter={() => HoverNavbar(false)}
                 onMouseLeave={() => HoverNavbar(true)}>
            <div className="navbar-background"></div>
            <nav>
                <LogoContainer text="ibroGeek" isActive={isActive}></LogoContainer>
                <ul className={`nav-links ${isActive ? 'active' : ''}`}>
                    <CustomLink to="/">Home</CustomLink>
                    <CustomLink to="/books">Books</CustomLink>
                    <CustomLink to="/about">About</CustomLink>
                    <CustomLink to="/contact">Contact</CustomLink>
                    <span className="nav-menu-line"></span>
                </ul>
                <ChangeThemeContainer></ChangeThemeContainer>
            </nav>
        </header>
    )
}



function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to);
    const match = useMatch({path: resolvedPath.pathname, end: true});
    const path = match ? match.pathname : "";
    return (
        <li className={path === to ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}

export default Navbar