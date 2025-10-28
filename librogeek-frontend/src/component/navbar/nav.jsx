import './navbar.css';

import LogoContainer from "./logoContainer.jsx";
import ChangeThemeContainer from "./changeThemeContainer.jsx";

const Navbar = () => {

    return (
        <header>
            <nav>
                <LogoContainer text="ibroGeek" isActive={false}></LogoContainer>
                <ul className="nav-links">
                    <CustomLink to="/">Home</CustomLink>
                    <CustomLink to="/books">Books</CustomLink>
                    <CustomLink to="/about">About</CustomLink>
                    <CustomLink to="/contact">Contact</CustomLink>
                </ul>
                <ChangeThemeContainer></ChangeThemeContainer>
            </nav>
        </header>
    )
}

function CustomLink({to, children, ...props}) {
    return (
        <li>
            <a href={to} {...props}>
                {children}
            </a>
        </li>
    )
}

export default Navbar