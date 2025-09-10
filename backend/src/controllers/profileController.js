import Profile from '../models/Profile.js';
import { successResponse, errorResponse } from '../utils/response.js';

const createProfile = async (req, res) => {
  try {
    const profileData = {
      ...req.body,
      userId: req.user._id
    };
    
    const profile = await Profile.create(profileData);
    
    // Add profile to user's profiles array
    await req.user.updateOne({ $push: { profiles: profile._id } });
    
    res.status(201).json(successResponse(profile, 'Profile created successfully'));
  } catch (error) {
    res.status(500).json(errorResponse(error.message, 500));
  }
};

const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.user._id });
    res.json(successResponse(profiles, 'Profiles retrieved successfully'));
  } catch (error) {
    res.status(500).json(errorResponse(error.message, 500));
  }
};

const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (profile) {
      res.json(successResponse(profile, 'Profile retrieved successfully'));
    } else {
      res.status(404).json(errorResponse('Profile not found', 404));
    }
  } catch (error) {
    res.status(500).json(errorResponse(error.message, 500));
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (profile) {
      res.json(successResponse(profile, 'Profile updated successfully'));
    } else {
      res.status(404).json(errorResponse('Profile not found', 404));
    }
  } catch (error) {
    res.status(500).json(errorResponse(error.message, 500));
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (profile) {
      // Remove profile from user's profiles array
      await req.user.updateOne({ $pull: { profiles: profile._id } });
      res.json(successResponse(profile, 'Profile deleted successfully'));
    } else {
      res.status(404).json(errorResponse('Profile not found', 404));
    }
  } catch (error) {
    res.status(500).json(errorResponse(error.message, 500));
  }
};

export { createProfile, getProfiles, getProfileById, updateProfile, deleteProfile };