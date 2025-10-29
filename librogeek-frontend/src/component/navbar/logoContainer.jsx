import './logoContainer.css';
import Logo from "../logo.jsx";
import {Link} from "react-router-dom";

export default function LogoContainer({text = '', isActive = false}) {
    return (
        <div className={`logo-container ${isActive ? 'active' : ''}`}>
            <Link to="/" className={"logo"}>
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
