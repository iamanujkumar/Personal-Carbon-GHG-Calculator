import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import calcService from '../services/calcService';
import apiClient from '../services/apiClient';

const CalculatorForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    transportation: {
      carType: '',
      distance: '',
      flightDistance: '',
      railDistance: ''
    },
    digital: {
      emails: '',
      videoCalls: '',
      websiteVisits: '',
      socialMedia: ''
    },
    events: {
      weddings: '',
      concerts: '',
      conferences: ''
    },
    food: {
      beefMeals: '',
      chickenMeals: '',
      vegetarianMeals: '',
      veganMeals: ''
    },
    household: {
      electricity: '',
      heating: {
        fuelType: '',
        amount: ''
      },
      water: '',
      waste: ''
    },
    shipping: {
      method: '',
      weight: '',
      distance: ''
    }
  });
  
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 3) {
        // For nested objects like household.heating.fuelType
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: {
              ...formData[parts[0]][parts[1]],
              [parts[2]]: value
            }
          }
        });
      } else {
        // For nested objects like transportation.carType
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const dataToSend = {
        transportation: {
          carType: formData.transportation.carType,
          distance: formData.transportation.distance ? parseFloat(formData.transportation.distance) : 0,
          flightDistance: formData.transportation.flightDistance ? parseFloat(formData.transportation.flightDistance) : 0,
          railDistance: formData.transportation.railDistance ? parseFloat(formData.transportation.railDistance) : 0
        },
        digital: {
          emails: formData.digital.emails ? parseInt(formData.digital.emails) : 0,
          videoCalls: formData.digital.videoCalls ? parseFloat(formData.digital.videoCalls) : 0,
          websiteVisits: formData.digital.websiteVisits ? parseInt(formData.digital.websiteVisits) : 0,
          socialMedia: formData.digital.socialMedia ? parseInt(formData.digital.socialMedia) : 0
        },
        events: {
          weddings: formData.events.weddings ? parseInt(formData.events.weddings) : 0,
          concerts: formData.events.concerts ? parseInt(formData.events.concerts) : 0,
          conferences: formData.events.conferences ? parseInt(formData.events.conferences) : 0
        },
        food: {
          beefMeals: formData.food.beefMeals ? parseInt(formData.food.beefMeals) : 0,
          chickenMeals: formData.food.chickenMeals ? parseInt(formData.food.chickenMeals) : 0,
          vegetarianMeals: formData.food.vegetarianMeals ? parseInt(formData.food.vegetarianMeals) : 0,
          veganMeals: formData.food.veganMeals ? parseInt(formData.food.veganMeals) : 0
        },
        household: {
          electricity: formData.household.electricity ? parseFloat(formData.household.electricity) : 0,
          heating: {
            fuelType: formData.household.heating.fuelType,
            amount: formData.household.heating.amount ? parseFloat(formData.household.heating.amount) : 0
          },
          water: formData.household.water ? parseFloat(formData.household.water) : 0,
          waste: formData.household.waste ? parseFloat(formData.household.waste) : 0
        },
        shipping: {
          method: formData.shipping.method,
          weight: formData.shipping.weight ? parseFloat(formData.shipping.weight) : 0,
          distance: formData.shipping.distance ? parseFloat(formData.shipping.distance) : 0
        }
      };

      if (user) {
        // Authenticated user - save calculation
        const response = await calcService.calculateEmissions(dataToSend, false); // false for authenticated endpoint
        console.log('Calculation response:', response);
        
        if (response.success) {
          onCalculate(response.data);
        } else {
          setError('Error calculating emissions: ' + response.message);
        }
      } else {
        // Unauthenticated user - use public API endpoint
        try {
          const response = await calcService.calculateEmissions(dataToSend, true); // true for public endpoint
          console.log('Public calculation response:', response);
          
          if (response.success) {
            onCalculate(response.data);
          } else {
            setError('Error calculating emissions: ' + response.message);
          }
        } catch (publicError) {
          console.error('Error with public calculation:', publicError);
          setError('Error calculating emissions. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error calculating emissions:', error);
      setError('Error calculating emissions. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}
      
      {/* Transportation */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Transportation</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
            <select
              name="transportation.carType"
              value={formData.transportation.carType}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            >
              <option value="">Select</option>
              <option value="gasoline">Gasoline</option>
              <option value="diesel">Diesel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
            <input
              type="number"
              name="transportation.distance"
              value={formData.transportation.distance}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flight Distance (km)</label>
            <input
              type="number"
              name="transportation.flightDistance"
              value={formData.transportation.flightDistance}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rail Distance (km)</label>
            <input
              type="number"
              name="transportation.railDistance"
              value={formData.transportation.railDistance}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Digital */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Digital Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emails with Attachments</label>
            <input
              type="number"
              name="digital.emails"
              value={formData.digital.emails}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Calls (hours)</label>
            <input
              type="number"
              name="digital.videoCalls"
              value={formData.digital.videoCalls}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website Visits</label>
            <input
              type="number"
              name="digital.websiteVisits"
              value={formData.digital.websiteVisits}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Posts</label>
            <input
              type="number"
              name="digital.socialMedia"
              value={formData.digital.socialMedia}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Attendance</label>
            <input
              type="number"
              name="events.weddings"
              value={formData.events.weddings}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Concert Attendance</label>
            <input
              type="number"
              name="events.concerts"
              value={formData.events.concerts}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conference Attendance</label>
            <input
              type="number"
              name="events.conferences"
              value={formData.events.conferences}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Food */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Food Choices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beef Meals</label>
            <input
              type="number"
              name="food.beefMeals"
              value={formData.food.beefMeals}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chicken Meals</label>
            <input
              type="number"
              name="food.chickenMeals"
              value={formData.food.chickenMeals}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vegetarian Meals</label>
            <input
              type="number"
              name="food.vegetarianMeals"
              value={formData.food.vegetarianMeals}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vegan Meals</label>
            <input
              type="number"
              name="food.veganMeals"
              value={formData.food.veganMeals}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Household */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Household Activities</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Usage (kWh)</label>
            <input
              type="number"
              name="household.electricity"
              value={formData.household.electricity}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heating Fuel Type</label>
            <select
              name="household.heating.fuelType"
              value={formData.household.heating.fuelType}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            >
              <option value="">Select</option>
              <option value="naturalGas">Natural Gas</option>
              <option value="oil">Oil</option>
              <option value="propane">Propane</option>
            </select>
          </div>
          
          {formData.household.heating.fuelType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.household.heating.fuelType === 'naturalGas' && 'Natural Gas Usage (kWh)'}
                {formData.household.heating.fuelType === 'oil' && 'Oil Usage (kWh)'}
                {formData.household.heating.fuelType === 'propane' && 'Propane Usage (kWh)'}
              </label>
              <input
                type="number"
                name="household.heating.amount"
                value={formData.household.heating.amount}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                min="0"
                step="0.1"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Water Usage (liters)</label>
            <input
              type="number"
              name="household.water"
              value={formData.household.water}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waste Production (kg)</label>
            <input
              type="number"
              name="household.waste"
              value={formData.household.waste}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
            <select
              name="shipping.method"
              value={formData.shipping.method}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            >
              <option value="">Select</option>
              <option value="air">Air</option>
              <option value="truck">Truck/Ground</option>
              <option value="ocean">Ocean/Water</option>
              <option value="rail">Rail</option>
            </select>
          </div>
          
          {formData.shipping.method && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Weight (kg)</label>
                <input
                  type="number"
                  name="shipping.weight"
                  value={formData.shipping.weight}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Distance (km)</label>
                <input
                  type="number"
                  name="shipping.distance"
                  value={formData.shipping.distance}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  min="0"
                  step="0.1"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate Emissions
        </button>
      </div>
      
      {!user && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <span className="font-semibold">Note:</span> You're using the calculator without an account. 
            <button 
              onClick={() => window.location.hash = '#/login'}
              className="ml-1 text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign up
            </button> to save your calculations and track your progress over time.
          </p>
        </div>
      )}
    </form>
  );
};

export default CalculatorForm;