import {useState} from "react";
import {STATIC_URL} from "../../../config/api.js";

const OrderItem = ({order}) => {
    console.log(order)
    const date = new Date(order.createdAt).toISOString().split('T')[0];

    const [open, setOpen] = useState(false);
    return (
        <div className="order-item">
            <div className="order-summary" onClick={() => setOpen(!open)}>
                <div>
                    <p className="order_id">{order.paymentId}</p>
                    <p className="order_user">{order.user.name}</p>
                </div>
                <div>
                    <p className="order_total_price">€{order.totalAmount}</p>
                    <p className="order_deal_type">{order.paymentMethod}</p>
                    <p className="order_deal_status">{order.status}</p>
                    <p className="order_date">{date}</p>
                    <div className={`triangle ${open ? "active" : ""}`}></div>
                </div>
            </div>
            <div order-details className={open ? "active" : ""}>
                <div className="order-shipping-info">
                    <h4>Shipping Information</h4>
                    {/*<p>{order.shippingInfo.fullName}</p>*/}
                    {/*<p>{order.shippingInfo.addressLine1}</p>*/}
                    {/*<p>{order.shippingInfo.addressLine2}</p>*/}
                    {/*<p>{order.shippingInfo.postcode}, {order.shippingInfo.city}</p>*/}
                    {/*<p>{order.shippingInfo.country}</p>*/}
                </div>
                <div className="order-books-list">
                    {order.books.map((book) => (
                        <div key={book.bookId} className="order-book-item">
                            <img src={STATIC_URL + "/" + book.cover_image} alt=""/>
                            <p className="book-title">{book.title}</p>
                            <p className="book-quantity">{book.description}</p>
                            <p className="book-price">€{book.price}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default OrderItem;