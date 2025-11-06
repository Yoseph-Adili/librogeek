import BrainCanvas from "./brainCanvas.jsx";
import {Link} from "react-router-dom";
import Logo from "../logo.jsx";

const Footer = () => {
    return (

        <footer id="footer">
            <BrainCanvas></BrainCanvas>
            <div className="footer-in">
                <div className="footer-left-menu">
                    <div className="footer-logo-container">

                        <Logo className={'footer-logo'}></Logo>
                        <span>inbroGeek</span>
                    </div>
                    <h2>Learn a little bit every day, <br/>and you'll get a little closer to your dream.</h2>
                    <ul>
                        <li><Link to="/">Home</Link>
                        </li>
                        <li><Link to="/books">Books</Link>
                        </li>
                        <li><Link to="/about">About</Link>
                        </li>
                        <li><Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-center">
                    {/*<div>*/}

                    {/*    <Logo className={'footer-logo'}></Logo>*/}
                    {/*    <span>inbroGeek</span>*/}
                    {/*</div>*/}
                    <div>
                        <p>
                            Built with React & Java
                        </p>
                        <p>
                            Made by Yoseph
                        </p>
                    </div>
                </div>
                <div className="footer-right-menu">
                    <h2>A soul that loves reading is forever young.</h2>
                    <ul>
                        <li><Link to="/">Home</Link>
                        </li>
                        <li><Link to="/books">Books</Link>
                        </li>
                        <li><Link to="/about">About</Link>
                        </li>
                        <li><Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )

}
export default Footer;