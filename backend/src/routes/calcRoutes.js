import express from 'express';
import { calculateEmissions, calculateEmissionsPublic, getCalculations, getCalculationById } from '../controllers/calcController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public endpoint for demo calculations
router.post('/public', calculateEmissionsPublic);

// Protected endpoints for authenticated users
router.route('/')
  .post(protect, calculateEmissions)
  .get(protect, getCalculations);

router.route('/:id')
  .get(protect, getCalculationById);

export default router;