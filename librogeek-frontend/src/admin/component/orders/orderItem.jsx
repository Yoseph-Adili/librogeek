import {useEffect, useState} from "react";
import {STATIC_URL} from "../../../config/api.js";

const OrderItem = ({order}) => {

    const date = new Date(order.createdAt).toISOString().split('T')[0];

    const [open, setOpen] = useState(false);
    const [userImage, setUserImage] = useState("");
    useEffect(() => {
        const photo = order.user?.profile_photo || "profile/unknown.jpg";
        setUserImage(`${STATIC_URL}/${photo}`);
    }, [order.user?.profile_photo]);

    return (<div className="order-item">
        <div className="order-summary" onClick={() => setOpen(!open)}>
            <div>

                <p className="order_id">{order.paymentId}</p>
                <p className="order_user">{order.user.name}</p>
            </div>
            <div>
                <p className="order_total_price">€{order.totalAmount}</p>
                <p className="order_deal_type">{order.paymentMethod}</p>


                <p className="order_deal_status">{order.paymentStatus}</p>
                <p className="order_date">{date}</p>
                <div className={`triangle ${open ? "active" : ""}`}></div>
            </div>
        </div>
        <div className={` order-details  ${open ? "active" : ""}`}>
            <div className="order-shipping-info">
                <div className="user-info">
                    <h3>User Info</h3>
                    <div className="user-details">
                        <img src={userImage} alt="User Profile" className="user-profile-image"/>
                        <div>
                            <p>Name: {order.user.name}</p>
                            <p>Email: {order.user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="address-info">
                    <h3>Address Info</h3>

                    <h4>{order.shippingInfo.fullName}</h4>
                    <p>address: {order.shippingInfo.addressLine1}</p>
                    <p>postcode: {order.shippingInfo.postcode}</p>
                    <p>city: {order.shippingInfo.city}</p>
                    <p>country: {order.shippingInfo.country}</p>
                    <p>Tel number: {order.shippingInfo.phoneNumber}</p>

                </div>

            </div>
            <div className="order-books-list">
                {order.books.map((book) => (
                    <div key={book.bookId} className="order-book-item">
                        <div>
                            <img src={STATIC_URL + "/" + book.cover_image} alt=""/>
                            <div>
                            <h4 className="book-title">{book.title}</h4>
                            <p className="book-quantity">{book.description}</p>
                            </div>
                        </div>
                        <p className="book-price">€{book.price}</p>
                    </div>
                ))}
            </div>

        </div>
    </div>);
};

export default OrderItem;