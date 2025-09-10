import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;