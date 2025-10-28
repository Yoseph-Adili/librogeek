import './logoContainer.css';
import Logo from "../logo.jsx";

export default function LogoContainer({text = '', isActive = false}) {
    return (
        <div className={`logo-container ${isActive ? 'active' : ''}`}>
            <a href="/" className={"logo"}>
            <Logo></Logo>
            </a>
            {text.split("").map((char, index) => (
                <span key={index} className="logo-text">
          {char}
        </span>
            ))}

        </div>
    )
}
