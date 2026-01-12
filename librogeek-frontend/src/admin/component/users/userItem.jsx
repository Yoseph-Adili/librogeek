import {Link} from "react-router-dom";

const UserItem = ({user}) => {
    const date = new Date(user.createdAt).toISOString().split('T')[0];

    return (
        <div className="user-item">
            <div>
                <p className="order_id">{user.user_id}</p>
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>

            </div>
            <div>
                {/*<p className="order_total_price">€{order.totalAmount}</p>*/}
                {/*<p className="order_deal_type">{order.paymentMethod}</p>*/}


                {/*<p className="order_deal_status">{order.paymentStatus}</p>*/}
                <p className={`user-role ${user.role}`}>{user.role}</p>
                <p className="order_date">{date}</p>
                <Link to={"/admin/user"}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={"24"} height={"24"}>
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M12 20H20.5M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6" stroke="var(--text-color)"
                                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                    </svg>
                </Link>
            </div>
        </div>
    );
}
export default UserItem;