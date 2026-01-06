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

// 注册 Chart.js 元素
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

const EarningLine = () => {
    const lineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Earnings in USD',
                data: [1200, 1900, 3000, 5000, 2300, 3400, 4500],
                borderColor: '#28a745',
                backgroundColor:'rgba(40,167,69,0.78)',
                tension: 0.5,
                // fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
            },

            {
                label: 'Earnings in 25',
                data: [120, 100, 3000, 500, 2300, 300, 4500],
                borderColor: 'rgba(40,167,69,0.52)',
                backgroundColor: 'rgba(40,167,69,0.1)',
                tension: 0.5,
                // fill: true,
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
                labels: { color: '#ccc' },
                position: 'top',
            },
            tooltip: {
                backgroundColor: '#333',
                titleColor: '#fff',
                bodyColor: '#fff',
            },
        },
        scales: {
            x: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.1)' } },
        },
    };

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <Line data={lineData} options={lineOptions} />
        </div>
    );
};

export default EarningLine;
