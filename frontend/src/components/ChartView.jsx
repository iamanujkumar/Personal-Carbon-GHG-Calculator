import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartView = ({ data }) => {
  const chartData = {
    labels: ['Transportation', 'Digital', 'Events', 'Food', 'Household', 'Shipping'],
    datasets: [
      {
        label: 'Emissions (kg CO₂e)',
        data: [
          data?.transportation || 0,
          data?.digital || 0,
          data?.events || 0,
          data?.food || 0,
          data?.household || 0,
          data?.shipping || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Carbon Footprint by Category',
      },
    },
  };

  // Handle case where data is not yet available
  if (!data) {
    return <div className="text-center py-4 text-gray-500">No data available</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartView;