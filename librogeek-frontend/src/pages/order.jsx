import Payment from "../component/payment.jsx";
import CartItem from "../component/navbar/cartItem.jsx";
import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import "./css/order.css"
import {STATIC_URL} from "../config/api.js";
import CustomizeTitle from "../component/cuntomizeTitle.jsx";
import {UserContext} from "../App.jsx";

const Order = () => {
    const [cart, setCart] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(stored) ? stored : [];
    });
    const {loginUser} = useContext(UserContext);
    if (!loginUser){
        return (
            <div className={"order-page-container"}>
                <div className="orders-container">
                    <CustomizeTitle title={"Orders"}></CustomizeTitle>
                    <h2>Please <Link to={"/login"}>login</Link> to view your orders.</h2>
                </div>
            </div>
        )
    }

    useEffect(() => {

        const handleCartUpdate = () => {
            const stored = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(Array.isArray(stored) && stored.length > 0 ? stored : []);

        };

        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, []);

    function removeBookFromCart(bookId) {
        const stored = JSON.parse(localStorage.getItem("cart")) || [];
        const newCart = stored.filter(item => item.bookId !== bookId);
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    }
    return (
        <div className={"order-page-container"}>
            <div className="orders-container">
                <CustomizeTitle title={"Orders"}></CustomizeTitle>
                <ul>
                    {cart.length > 0 ? (
                        cart.map(item => (
                                <li key={item.bookId}>
                                    <div className="order-cover-container">
                                        <img src={STATIC_URL + "/" + item.cover_image} alt=""/>
                                    </div>
                                    <div className="order-info-container">
                                        <h2>{item.title}</h2>
                                        <p>{item.description}</p>

                                        <div className="delete-order-container"  >
                                            <span>€ {item.price}</span>
                                            <div className={"delete-container"} onClick={()=>{removeBookFromCart(item.bookId)}}>
                                                <span>Remove</span>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path d="M10 11V17" strokeWidth="1.6" strokeLinecap="round"
                                                          strokeLinejoin="round"></path>
                                                    <path d="M14 11V17" strokeWidth="1.6" strokeLinecap="round"
                                                          strokeLinejoin="round"></path>
                                                    <path d="M4 7H20" strokeWidth="1.6" strokeLinecap="round"
                                                          strokeLinejoin="round"></path>
                                                    <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                                                          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                                                          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </g>
                                            </svg>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                        ))
                    ) : (
                        <li>No items</li>
                    )}
                </ul>
            </div>
            <Payment></Payment>
        </div>
    )
}
export default Order