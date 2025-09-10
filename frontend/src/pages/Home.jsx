import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import CalculatorForm from '../components/CalculatorForm';
import ResultCard from '../components/ResultCard';

const Home = () => {
  const [calculationResult, setCalculationResult] = useState(null);
  const { user } = useContext(AuthContext);

  const handleCalculate = (result) => {
    setCalculationResult(result);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Personal Carbon & GHG Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate your carbon footprint based on your daily activities, travel, food choices, and more.
        </p>
        
        {!user && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <p className="text-blue-800">
              <span className="font-semibold">Note:</span> You can use the calculator without an account. 
              <a href="/login" className="ml-1 text-blue-600 hover:text-blue-800 font-medium underline">
                Sign up
              </a> to save your calculations, track your progress over time, and create profiles for different scenarios.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Enter Your Data</h2>
          <CalculatorForm onCalculate={handleCalculate} />
          
          {!user && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800">
                <span className="font-semibold">Save your calculations:</span> 
                <a href="/#/login" className="ml-1 text-yellow-600 hover:text-yellow-800 font-medium underline">
                  Create an account
                </a> to save your results, track your progress over time, and compare different scenarios.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Results</h2>
          <ResultCard calculationResult={calculationResult} />
        </div>
      </div>
      
    </div>
  );
};

export default Home;