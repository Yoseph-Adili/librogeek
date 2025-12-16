import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {UserContext} from "../../App.jsx";
import CartItem from "./cartItem.jsx";

export default function ChangeThemeContainer() {
    let currentTheme = false;
    const storedTheme = localStorage.getItem("theme");
    const [cart, setCart] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(stored) ? stored : [];
    });
    const [cartOpen, setCartOpen] = useState(false);
    useEffect(() => {

        const handleCartUpdate = () => {
            const stored = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(Array.isArray(stored) && stored.length > 0 ? stored : []);
            if (cart.length <= 0) {
                setCartOpen(false);
            }

        };

        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, []);



    if (storedTheme) {
        if (storedTheme === "light") {
            currentTheme = true;
        } else {
            currentTheme = false;
        }
    } else {
        const prefers = window.matchMedia("(prefers-color-scheme: light)");
        if (prefers.matches) {
            currentTheme = true;
        } else {
            currentTheme = false;
        }
    }
    const [themeIcon, setThemeIcon] = useState(currentTheme);
    const changeTheme = () => {
        const app = document.querySelector(".app");
        const isLight = currentTheme;
        const themeIconElement = document.querySelectorAll(".change-theme-button svg");
        if (!app) return;
        if (isLight) {
            app.classList.remove("light-theme");
            localStorage.setItem("theme", "dark");
            setThemeIcon(false);
            themeIconElement.forEach(el => el.style.animation = " rotateSun 0.5s linear infinite");
            setTimeout(() => {
                themeIconElement.forEach(el => el.style.animation = "");
            }, 500);

        } else {
            app.classList.add("light-theme");
            localStorage.setItem("theme", "light");
            setThemeIcon(true);
            themeIconElement.forEach(el => el.style.animation = " rotateSun 0.5s linear infinite");
            setTimeout(() => {
                themeIconElement.forEach(el => el.style.animation = "");
            }, 500);
        }
    };

    const [menuOpen, setMenuOpen] = useState(false);
    // const [user, setUser] = useState(null);
    const {loginUser} = useContext(UserContext);


    function toggleMenu() {
        if (menuOpen) {
            setMenuOpen(false);
        } else {
            setMenuOpen(true);
        }


    }

    return (
        <div className="change-theme-container">
            <div className={"cart-container"}
                onClick={() => {
                    setCartOpen(prev => !prev);
                    setMenuOpen(false);
                }}
                 style={{
                     opacity: cart.length > 0 ? "1" : "0",
                     pointerEvents:cart.length > 0 ? "" : "none",
                     cursor:"pointer"
            }}>
    <span>{cart.length}</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                        stroke="var(--text-color)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="change-theme-button" onClick={changeTheme}>


                <svg className={`sun ${themeIcon ? '' : 'active'}`} viewBox="0 0 31 32"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" fill="var(--text-color)"
                          d="M16.275 4V0.8C16.275 0.358176 15.928 0 15.5 0C15.072 0 14.725 0.358176 14.725 0.8V4C14.725 4.44182 15.072 4.8 15.5 4.8C15.928 4.8 16.275 4.44182 16.275 4ZM15.5006 24C18.4414 24 21.089 22.2926 22.404 19.6374C22.5988 19.2441 23.0657 19.0882 23.4469 19.2893C23.8279 19.4904 23.979 19.9724 23.7841 20.3658C22.2066 23.551 19.0291 25.6 15.5006 25.6C10.3642 25.6 6.20062 21.3015 6.20062 16C6.20062 13.6373 7.02755 11.4738 8.39899 9.80128L4.5394 5.8172C4.23675 5.5048 4.23675 4.99824 4.5394 4.68583C4.84205 4.37342 5.33277 4.37342 5.63541 4.68583L9.49499 8.66992C11.1153 7.25392 13.2113 6.4 15.5006 6.4C20.375 6.4 24.3748 10.2731 24.7688 15.2H30.225C30.653 15.2 31 15.5582 31 16C31 16.4418 30.653 16.8 30.225 16.8H22.475C22.047 16.8 21.7 16.4418 21.7 16C21.7 15.5582 22.047 15.2 22.475 15.2H23.2123C22.8234 11.1581 19.5184 8 15.5006 8C13.6395 8 11.9316 8.67728 10.5956 9.806L11.3983 10.6346C11.701 10.947 11.701 11.4536 11.3983 11.766C11.0957 12.0784 10.6049 12.0784 10.3023 11.766L9.49956 10.9374C8.40642 12.3165 7.75062 14.0793 7.75062 16C7.75062 20.4179 11.2203 24 15.5006 24ZM10.85 16C10.85 18.651 12.9319 20.8 15.5 20.8C15.928 20.8 16.275 21.1582 16.275 21.6C16.275 22.0418 15.928 22.4 15.5 22.4C12.0758 22.4 9.3 19.5346 9.3 16C9.3 15.5582 9.64697 15.2 10.075 15.2C10.503 15.2 10.85 15.5582 10.85 16ZM16.275 28V31.2C16.275 31.6418 15.928 32 15.5 32C15.072 32 14.725 31.6418 14.725 31.2V28C14.725 27.5582 15.072 27.2 15.5 27.2C15.928 27.2 16.275 27.5582 16.275 28ZM3.875 16.8H0.775C0.346983 16.8 0 16.4418 0 16C0 15.5582 0.346983 15.2 0.775 15.2H3.875C4.30302 15.2 4.65 15.5582 4.65 16C4.65 16.4418 4.30302 16.8 3.875 16.8ZM23.1727 25.0516L25.3644 27.314C25.6671 27.6264 26.1578 27.6264 26.4604 27.314C26.7631 27.0016 26.7631 26.495 26.4604 26.1826L24.2687 23.9202C23.9661 23.6078 23.4754 23.6078 23.1727 23.9202C22.8701 24.2326 22.8701 24.7392 23.1727 25.0516ZM6.73126 23.9202L4.53955 26.1826C4.2369 26.495 4.2369 27.0016 4.53955 27.314C4.8422 27.6264 5.33293 27.6264 5.63557 27.314L7.82727 25.0516C8.1299 24.7392 8.1299 24.2326 7.82727 23.9202C7.52463 23.6078 7.0339 23.6078 6.73126 23.9202ZM23.1729 6.94824L25.3646 4.68583C25.6672 4.37342 26.158 4.37342 26.4606 4.68583C26.7632 4.99824 26.7632 5.5048 26.4606 5.8172L24.2689 8.0796C23.9663 8.392 23.4755 8.392 23.1729 8.0796C22.8703 7.7672 22.8703 7.26064 23.1729 6.94824Z"></path>
                </svg>
                <svg className={`moon ${themeIcon ? 'active' : ''}`} viewBox="0 0 48 48"
                     xmlns="http://www.w3.org/2000/svg">
                    <g id="night">
                        <g id="night_2">
                            <path fillRule="evenodd" clipRule="evenodd" fill="var(--text-color)"
                                  d="M20.7808 39.678C30.2725 41.5227 38.9355 34.9129 39.9084 25.7064C25.3849 34.6376 13.3977 22.6246 22.2943 8.08028C13.086 9.04803 6.46841 17.7148 8.31368 27.2111C9.20895 31.8246 12.2255 35.8586 16.3944 38.1053C16.8806 38.3673 17.0623 38.9738 16.8003 39.46C16.5383 39.9462 15.9318 40.1279 15.4456 39.8659C10.7538 37.3374 7.36096 32.8002 6.35035 27.5923C4.19047 16.477 12.3759 6.3517 23.4224 6.00003C24.3791 5.97168 25.0622 6.89645 24.8058 7.79733L24.6708 8.08611C15.4263 21.6734 26.3363 32.6062 39.8994 23.3282L40.1834 23.1938C41.0866 22.9297 42.0251 23.6154 41.9895 24.5754C41.6379 35.6187 31.5135 43.8013 20.3992 41.6412C19.8571 41.5359 19.503 41.0109 19.6084 40.4688C19.7137 39.9267 20.2386 39.5726 20.7808 39.678ZM12.2323 26.4109C13.1386 31.0805 16.9115 34.8534 21.5811 35.7597C22.1233 35.8649 22.4775 36.3897 22.3723 36.9319C22.267 37.4741 21.7422 37.8283 21.2001 37.7231C15.7297 36.6614 11.3306 32.2623 10.2689 26.7919C10.1637 26.2497 10.5179 25.7249 11.0601 25.6197C11.6022 25.5145 12.127 25.8687 12.2323 26.4109Z"></path>
                        </g>
                    </g>
                </svg>

            </div>
            <div className="user-icon" onClick={()=>{
                toggleMenu();
                setCartOpen(false)
            }}>

                <svg viewBox="0 0 38 51" fill="var(--text-color)" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_13_53)">
                        <path
                            d="M19 22.3125C12.8883 22.3125 7.91667 17.3081 7.91667 11.1562C7.91667 5.00437 12.8883 0 19 0C25.1117 0 30.0833 5.00437 30.0833 11.1562C30.0833 17.3081 25.1117 22.3125 19 22.3125ZM19 3.1875C14.6348 3.1875 11.0833 6.76228 11.0833 11.1562C11.0833 15.5502 14.6348 19.125 19 19.125C23.3652 19.125 26.9167 15.5502 26.9167 11.1562C26.9167 6.76228 23.3652 3.1875 19 3.1875ZM36.4167 51C35.9968 51 35.594 50.832 35.2971 50.5332C35.0002 50.2344 34.8333 49.8289 34.8333 49.4062V39.6605C34.8303 36.7269 33.6715 33.9144 31.6109 31.8399C29.5502 29.7654 26.7563 28.5984 23.8418 28.5951H14.1582C11.2438 28.5984 8.44978 29.7654 6.38915 31.8399C4.32852 33.9144 3.1696 36.7269 3.16667 39.6605V49.4062C3.16667 49.8289 2.99985 50.2344 2.70292 50.5332C2.40599 50.832 2.00327 51 1.58333 51C1.16341 51 0.760681 50.832 0.463747 50.5332C0.166815 50.2344 0 49.8289 0 49.4062V39.6605C0 31.8033 6.35233 25.4076 14.1582 25.4076H23.8418C31.6477 25.4076 38 31.8017 38 39.6605V49.4062C38 49.8289 37.8331 50.2344 37.5362 50.5332C37.2394 50.832 36.8366 51 36.4167 51Z"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_13_53">
                            <rect width="38" height="51" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>

            </div>
            {loginUser ? (
                <div className={`menu ${menuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link to={`/profile/${loginUser.username}`}>Profile</Link></li>
                        <li><Link to="/setting">Settings</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>
            ) : (
                <div className={`menu ${menuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>

                    </ul>
                </div>
            )

            }
            <div className={`menu ${cartOpen ? 'active' : ''} cart-menu`}>
                <ul>
                    {cart.length > 0 ? (
                        cart.map(item => (
                            <CartItem key={item.bookId} book={item}></CartItem>
                        ))
                    ) : (
                        <li>No items</li>
                    )}
                    <li><Link to="/order">Orders</Link></li>
                </ul>
            </div>

        </div>
    )
}


