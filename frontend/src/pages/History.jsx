import React, { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import calcService from '../services/calcService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const History = () => {
  const [calculations, setCalculations] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCalculations = async () => {
      try {
        setLoading(true);
        const response = await calcService.getCalculations();
        if (response.success) {
          setCalculations(response.data);
          
          // Prepare chart data
          const sortedData = response.data.sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          );
          
          setChartData({
            labels: sortedData.map(c => new Date(c.createdAt).toLocaleDateString()),
            datasets: [
              {
                label: 'Total Emissions (kg CO₂e)',
                data: sortedData.map(c => c.results.total),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
              }
            ]
          });
        } else {
          setError(response.message || 'Failed to fetch calculations');
        }
      } catch (err) {
        setError('Failed to fetch calculations: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculations();
  }, [user]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Carbon Footprint Over Time',
      },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Calculation History</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Calculation History</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No history yet</h3>
            <p className="mt-1 text-gray-500">
              Sign in to save and track your carbon footprint calculations over time.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Calculation History</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Calculation History</h1>
      
      {calculations.length > 1 ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Emissions Trend</h2>
          {chartData.labels ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Emissions Trend</h2>
          <p className="text-gray-500">Chart will be available after you have at least 2 calculations</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transportation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Digital
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Events
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Food
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Household
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total (kg CO₂e)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {calculations.length > 0 ? (
              calculations.map((calc) => (
                <tr key={calc._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(calc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calc.results.transportation.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calc.results.digital.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calc.results.events.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calc.results.food.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calc.results.household.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {calc.results.total.toFixed(1)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No calculations yet. Perform a calculation to see your history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;