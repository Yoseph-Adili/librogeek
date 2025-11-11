// src/layout/MainLayout.jsx
import Navbar from "../component/navbar/nav.jsx";
import Footer from "../component/footer/footer.jsx";
import AnimatedBackground from "../component/AnimatedBackground.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="app">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <AnimatedBackground />
            <Footer />
        </div>
    );
};

export default MainLayout;
