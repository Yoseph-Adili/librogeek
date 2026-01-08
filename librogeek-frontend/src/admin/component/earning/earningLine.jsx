import {Line} from "react-chartjs-2";
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

const EarningLine = ({data}) => {
    const sortedDates = Object.keys(data).sort(
        (a, b) => new Date(a) - new Date(b)
    );
    const totalAmounts = sortedDates.map(
        date => data[date].amount
    );


    const pdfAmounts = sortedDates.map(date =>
        data[date].bookType === "PDF"
            ? data[date].amount
            : 0
    );

    const physicalAmounts = sortedDates.map(date =>
        data[date].bookType === "PHYSICAL"
            ? data[date].amount
            : 0
    );

    const lineData = {
        labels: sortedDates,
        datasets: [


            pdfAmounts.some(v => v > 0) && {
                label: 'PDF Earnings in EUR',
                data: pdfAmounts,
                borderColor: '#652F8D',
                backgroundColor: '#652F8D',
                tension: 0.5,
                // fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
            },

            physicalAmounts.some(v => v > 0) && {
                label: 'Physical Earnings in EUR',
                data: physicalAmounts,
                borderColor: '#EE4037',
                backgroundColor: '#EE4037',
                tension: 0.5,
                // fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Total Earnings in EUR',
                data: totalAmounts,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40,167,69,0.3)',
                tension: 0.5,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ].filter(Boolean),
    };


    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {color: '#787878'},
                position: 'top',
            },
            tooltip: {
                backgroundColor: '#333',
                bodyColor: '#787878',
            },
        },
        scales: {
            x: {ticks: {color: '#787878'}, grid: {color: 'rgba(120,120,120,0.25)'}},
            y: {ticks: {color: '#787878'}, grid: {color: 'rgba(120,120,120,0.25)'}},
        },
    };

    return (
        <div style={{height: '300px', width: '100%'}}>
            <Line data={lineData} options={lineOptions}/>
        </div>
    );
};

export default EarningLine;
