import "./adminNav.css"
import {Link, useMatch, useResolvedPath} from "react-router-dom";
import LogoContainer from "./logoContainer.jsx";

import AdminChangeThemeContainer from "./adminChangeThemeContainer.jsx";

const AdminNav = () => {

    return (
        <header>
            <div className="navbar-background"></div>
            <nav>
                <LogoContainer text="ibroAdmin" isActive={false}></LogoContainer>
                <ul className={`nav-links`} id={"admin-nav-links"}>
                    <CustomLink to="/admin/books">Books</CustomLink>
                    <CustomLink to="/admin/earning">Earning</CustomLink>
                    <CustomLink to="/admin/orders">Orders</CustomLink>
                    <CustomLink to="/admin/users">Users</CustomLink>
                    <span className="nav-menu-line"></span>
                </ul>
                <AdminChangeThemeContainer></AdminChangeThemeContainer>
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

export default AdminNav