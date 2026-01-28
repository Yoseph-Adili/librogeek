import "./adminNav.css"
import {Link, Navigate, useMatch, useResolvedPath} from "react-router-dom";
import LogoContainer from "./logoContainer.jsx";

import AdminChangeThemeContainer from "./adminChangeThemeContainer.jsx";
import {useContext} from "react";
import {UserContext} from "../../../App.jsx";

const AdminNav = () => {
    const { loginUser } = useContext(UserContext);
    if (loginUser === undefined) return <div className="page-loading">Loading...</div>;
    // if (loginUser === undefined) return <Navigate to="/login" replace />;
    if (!loginUser) return <Navigate to="/login" replace />;
    if (loginUser.role !== "ADMIN") return <Navigate to="/" replace />;
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