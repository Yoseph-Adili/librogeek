

import {Link} from "react-router-dom";
import Logo from "../../../component/logo.jsx";

export default function LogoContainer({text = '', isActive = false}) {
    return (
        <div className={`logo-container ${isActive ? 'active' : ''}`}>
            <Link to="/admin" className={"logo"}>
            <Logo></Logo>
            </Link>
            {text.split("").map((char, index) => (
                <span key={index} className="logo-text">
          {char}
        </span>
            ))}

        </div>
    )
}
