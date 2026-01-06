import "./earning.css"
import {Bar, Doughnut, Line} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import EarningLine from "./component/earning/earningLine.jsx";
import {useContext, useEffect} from "react";
import {API_URL} from "../config/api.js";
import {UserContext} from "../App.jsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Earning = () => {
    const token = localStorage.getItem("token") || null;
    const {loginUser} = useContext(UserContext);
    useEffect(() => {
        if (!loginUser || loginUser.role !== "ADMIN") return;
        fetch(`${API_URL}/books/userBookShelf`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setBookShelfBooks(data.data);
            });


    }, [loginUser]);
    return (
        <div className={"earning-page-container"}>
            <h1>Earning</h1>
            <div className="earning-charts-container">
                <div className="earning-count-container">
                    <h2>Total Earnings:
                        <br/>
                        <span style={{color: '#28a745'}}>$20,000</span>
                    </h2>
                    <h2>Monthly Earnings:
                        <br/>
                        <span style={{color: '#28a745'}}>$20,000</span>
                    </h2>
                    <h2>Weekly Earnings:
                        <br/>
                        <span style={{color: '#28a745'}}>$20,000</span>
                    </h2>
                </div>

                <div className={"chart-line"}>

                    <EarningLine></EarningLine>
                </div>
                <div className={"chart-doughnut"}>
                    <Doughnut data={{
                        labels: ['Books', 'Electronics', 'Clothing', 'Home & Kitchen'],
                        datasets: [
                            {
                                label: 'Sales Distribution',
                                data: [300, 50, 100, 80],
                                backgroundColor: [
                                    '#EE4037',
                                    '#652F8D',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                ],
                                borderColor: [
                                    '#EE4037',
                                    '#652F8D',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    }}/>
                </div>
            </div>
            <h1>Books</h1>
            <div className="books-charts-container">

                <div className={"chart-bar chart-line"}>
                    <Bar data={{
                        labels: ['Book A', 'Book B', 'Book C', 'Book D', 'Book E'],
                        datasets: [
                            {
                                label: 'Units Sold',
                                data: [150, 200, 100, 250, 300],
                                backgroundColor: '#28a745',
                            },

                        ],

                    }}/>
                </div>
                <div className={"chart-doughnut"}>
                    <Doughnut data={{
                        labels: ['Fiction', 'Non-Fiction', 'Science', 'History'],
                        datasets: [
                            {
                                label: 'Genre Distribution',
                                data: [120, 90, 60, 30],
                                backgroundColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#4BC0C0',
                                ],
                                borderColor: [
                                    '#FF6384',
                                    '#36A2EB',
                                    '#FFCE56',
                                    '#4BC0C0',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    }}/>
                </div>
            </div>
        </div>
    )
}
export default Earning;