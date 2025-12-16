import {STATIC_URL} from "../../config/api.js";

const CartItem = ({book}) => {
    function removeBookFromCart() {
        const stored = JSON.parse(localStorage.getItem("cart")) || [];
        const newCart = stored.filter(item => item.bookId !== book.bookId);
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    }
    return (
        <li>
            <div className="item-cover-container">
                <img src={STATIC_URL + "/" + book.cover_image} alt=""/>
            </div>
            <div className="item-info-container">
                <h4>{book.title}</h4>
                <p>{book.description}</p>
            </div>
            <div className="delete-item-container" onClick={removeBookFromCart} >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M10 11V17" stroke="var(--text-color)" strokeWidth="1.6" strokeLinecap="round"
                              strokeLinejoin="round"></path>
                        <path d="M14 11V17" stroke="var(--text-color)" strokeWidth="1.6" strokeLinecap="round"
                              strokeLinejoin="round"></path>
                        <path d="M4 7H20" stroke="var(--text-color)" strokeWidth="1.6" strokeLinecap="round"
                              strokeLinejoin="round"></path>
                        <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                              stroke="var(--text-color)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="var(--text-color)"
                              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                </svg>
            </div>
        </li>
    )
}
export default CartItem