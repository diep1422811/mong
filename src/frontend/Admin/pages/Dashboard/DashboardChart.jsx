import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

const DashboardChart = () => {
    const [chartData, setChartData] = useState({ categories: [], series: [] });

    // Gọi API để lấy dữ liệu cho biểu đồ
    const fetchChartData = async (filterType = "24h") => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found");
            const response = await fetch(`http://3.26.145.187:8000/api/dashboard/chart-data?period=${filterType}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            },);
            const data = await response.json();
            setChartData(data);
        } catch (error) {
            console.error("Error fetching chart data:", error);
        }
    };

    useEffect(() => {
        fetchChartData(); // Lấy dữ liệu theo mặc định (24h)
    }, []);

    // Cấu hình biểu đồ
    const chartOptions = {
        chart: {
            id: "dashboard-chart",
            type: "line",
            height: "400px",
            background: "linear-gradient(90deg,rgb(235, 174, 182) 0%,rgb(254, 204, 209) 70% )",
            
        },
        xaxis: {
            categories: chartData.categories,
        },
        yaxis: {
            title: {
                text: "Count",
            },
        },
        stroke: {
            curve: "smooth",
        },
        tooltip: {
            enabled: true,
        },
        legend: {
            position: "top",
        },
    };

    return (
        <div>
            <div className="chart-controls">
                <button onClick={() => fetchChartData("24h")}>Last 24 Hours</button>
                <button onClick={() => fetchChartData("week")}>Last Week</button>
                <button onClick={() => fetchChartData("month")}>Last Month</button>
            </div>

            <ApexCharts
                options={chartOptions}
                series={chartData.series}
                type="line"
                height={400}
            />
        </div>
    );
};

export default DashboardChart;
