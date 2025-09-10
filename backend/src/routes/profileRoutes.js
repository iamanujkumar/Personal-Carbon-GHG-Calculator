import express from 'express';
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
} from '../controllers/profileController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createProfile)
  .get(protect, getProfiles);

router.route('/:id')
  .get(protect, getProfileById)
  .put(protect, updateProfile)
  .delete(protect, deleteProfile);

export default router;