
import {Outlet, Navigate} from "react-router-dom";

import {UserContext} from "../App.jsx";
import {useContext} from "react";
import AdminNav from "../admin/component/adminNav/adminNav.jsx";

const AdminLayout = () => {
    const {loginUser} = useContext(UserContext);

    console.log("AdminLayout loginUser:", loginUser);
    if (loginUser === undefined) return <div>Loading...</div>;
    if (loginUser === null) return <Navigate to="/login" replace/>;
    if (loginUser.role !== "ADMIN") return <Navigate to="/" replace/>;

    return (
        <div className="app">
            <AdminNav/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
};

export default AdminLayout;
