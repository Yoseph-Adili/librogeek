import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const OrderLine = ({ method, data, color = '#28a745' }) => {

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const lineData = {
        labels: sortedData.map(item => item.date),
        datasets: [
            {
                label: method,
                data: sortedData.map(item => item.count),
                borderColor: color,
                backgroundColor: color,
                tension: 0.5,
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#787878' },
                position: 'top',
            },
            tooltip: {
                backgroundColor: '#333',
                bodyColor: '#ffffff',
            },
        },
        scales: {
            x: { ticks: { color: '#787878' }, grid: { color: 'rgba(120,120,120,0.25)' } },
            y: { ticks: { color: '#787878' }, grid: { color: 'rgba(120,120,120,0.25)' } },
        },
    };

    return (
        <div>
            <Line data={lineData} options={lineOptions} />
        </div>
    );
};

export default OrderLine;
