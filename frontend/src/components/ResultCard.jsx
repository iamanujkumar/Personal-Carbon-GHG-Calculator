import React, { useState, useEffect } from 'react';
import ChartView from './ChartView';

const ResultCard = ({ calculationResult }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (calculationResult) {
      setResults(calculationResult.results);
    }
  }, [calculationResult]);

  if (!results) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Total Carbon Footprint</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-400">-</div>
            <div className="text-gray-500">kg CO₂e</div>
            <p className="mt-4 text-gray-500">Enter your data and click "Calculate Emissions" to see your carbon footprint</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown by Category</h3>
          <p className="text-gray-500">Results will appear here after calculation</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">What You Can Do</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Reduce car travel by using public transportation</li>
            <li>Limit beef consumption, which has a high carbon footprint</li>
            <li>Be mindful of your electricity usage</li>
            <li>Reduce waste by recycling and composting</li>
          </ul>
        </div>
      </div>
    );
  }

  const categories = [
    { name: 'Transportation', value: results.transportation, color: 'bg-blue-500' },
    { name: 'Digital Usage', value: results.digital, color: 'bg-green-500' },
    { name: 'Events', value: results.events, color: 'bg-yellow-500' },
    { name: 'Food Choices', value: results.food, color: 'bg-red-500' },
    { name: 'Household', value: results.household, color: 'bg-purple-500' },
    { name: 'Shipping', value: results.shipping, color: 'bg-indigo-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Total Carbon Footprint</h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{results.total.toFixed(1)}</div>
          <div className="text-gray-500">kg CO₂e</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown by Category</h3>
        <div className="space-y-4">
          {categories.map((category) => (
            category.value > 0 && (
              <div key={category.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm font-medium text-gray-700">{category.value.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${category.color}`}
                    style={{ width: `${results.total > 0 ? (category.value / results.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Visualization</h3>
        <ChartView data={results} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">What You Can Do</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Reduce car travel by using public transportation</li>
          <li>Limit beef consumption, which has a high carbon footprint</li>
          <li>Be mindful of your electricity usage</li>
          <li>Reduce waste by recycling and composting</li>
          <li>Limit video calls and streaming to reduce digital emissions</li>
          <li>Attend fewer high-impact events like weddings and conferences when possible</li>
          <li>Choose ground shipping over air shipping when possible</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultCard;