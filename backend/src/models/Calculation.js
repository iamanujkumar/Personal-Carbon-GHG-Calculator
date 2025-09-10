import mongoose from 'mongoose';

const calculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  inputs: {
    transportation: {
      carType: String,
      distance: Number,
      publicTransport: String,
      flightDistance: Number
    },
    digital: {
      emails: Number,
      videoCalls: Number,
      websiteVisits: Number,
      socialMedia: Number
    },
    events: {
      weddings: Number,
      concerts: Number,
      conferences: Number
    },
    food: {
      beefMeals: Number,
      chickenMeals: Number,
      vegetarianMeals: Number,
      veganMeals: Number
    },
    household: {
      electricity: Number,
      naturalGas: Number,
      water: Number,
      waste: Number
    }
  },
  results: {
    transportation: Number,
    digital: Number,
    events: Number,
    food: Number,
    household: Number,
    total: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Calculation = mongoose.model('Calculation', calculationSchema);

export default Calculation;