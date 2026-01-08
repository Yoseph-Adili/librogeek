import "./orders.css";
import {useContext, useEffect, useState} from "react";
import OrderLine from "./component/orders/ordersLine.jsx";
import OrderItem from "./component/orders/orderItem.jsx";
import {UserContext} from "../App.jsx";
import {API_URL} from "../config/api.js";

const Orders = () => {
    const token = localStorage.getItem("token") || null;
    const {loginUser} = useContext(UserContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        if (!loginUser || loginUser.role !== "ADMIN") return;
        fetch(`${API_URL}/shipping/allUserOrders`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        })
            .then(res => res.json())
            .then(data => {

                if (data.success) {
                    setOrders(data.data);
                }
            });

    }, [loginUser]);


    function groupOrdersByMethodAndDate(orders) {

        const dailyOrders = {};

        orders.forEach(item => {
            const date = new Date(item.createdAt).toISOString().split('T')[0];
            const method = item.paymentMethod;

            if (!dailyOrders[date]) {
                dailyOrders[date] = {};
            }

            if (!dailyOrders[date][method]) {
                dailyOrders[date][method] = 0;
            }

            dailyOrders[date][method]++;
        });

        const methodArrays = {};

        Object.entries(dailyOrders).forEach(([date, methods]) => {
            Object.entries(methods).forEach(([method, count]) => {
                if (!methodArrays[method]) {
                    methodArrays[method] = [];
                }
                methodArrays[method].push({date, count});
            });
        });

        return methodArrays;
    }

    const ordersByMethod = groupOrdersByMethodAndDate(orders);
    console.log(orders)

    return (
        <div className={"orders-page-container"}>
            <form action="" className={"order-search-form"}>
                <input type="text" name="name"
                    // onChange={(e) => {setSearchQuery(e.target.value)}}
                />
            </form>
            <div className="orders-line-container">
                {Object.entries(ordersByMethod).map(([method, data]) => (
                    <OrderLine
                        key={method}
                        method={method}
                        data={data}
                    />
                ))}
            </div>

            <p>Orders</p>
            <div className="orders-item-container">
                {orders.map((order) => (
                    <OrderItem order={order} key={order.paymentId} />
                ))}
            </div>
        </div>
    );
};

export default Orders;