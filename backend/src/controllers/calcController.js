import Calculation from '../models/Calculation.js';
import { calculateTotalEmissions } from '../services/calculator.js';
import { successResponse, errorResponse } from '../utils/response.js';

const calculateEmissions = async (req, res) => {
  try {
    const inputs = req.body;
    const results = calculateTotalEmissions(inputs);
    
    const calculation = await Calculation.create({
      userId: req.user._id,
      inputs,
      results
    });
    
    res.status(201).json(successResponse(calculation, 'Calculation completed successfully'));
  } catch (error) {
    console.error('Error in calculateEmissions:', error);
    res.status(500).json(errorResponse(error.message, 500));
  }
};

// Public endpoint for demo calculations without authentication
const calculateEmissionsPublic = async (req, res) => {
  try {
    const inputs = req.body;
    const results = calculateTotalEmissions(inputs);
    
    // Create a mock calculation object without saving to database
    const mockCalculation = {
      _id: 'demo-' + Date.now(),
      userId: null,
      inputs,
      results,
      createdAt: new Date().toISOString()
    };
    
    res.status(200).json(successResponse(mockCalculation, 'Calculation completed successfully'));
  } catch (error) {
    console.error('Error in calculateEmissionsPublic:', error);
    res.status(500).json(errorResponse(error.message, 500));
  }
};

const getCalculations = async (req, res) => {
  try {
    const calculations = await Calculation.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(successResponse(calculations, 'Calculations retrieved successfully'));
  } catch (error) {
    console.error('Error in getCalculations:', error);
    res.status(500).json(errorResponse(error.message, 500));
  }
};

const getCalculationById = async (req, res) => {
  try {
    const calculation = await Calculation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (calculation) {
      res.json(successResponse(calculation, 'Calculation retrieved successfully'));
    } else {
      res.status(404).json(errorResponse('Calculation not found', 404));
    }
  } catch (error) {
    console.error('Error in getCalculationById:', error);
    res.status(500).json(errorResponse(error.message, 500));
  }
};

export { calculateEmissions, calculateEmissionsPublic, getCalculations, getCalculationById };