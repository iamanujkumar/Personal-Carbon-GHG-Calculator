import { getEmissionFactors } from './factorService.js';

const calculateTransportation = (inputs, factors) => {
  let total = 0;
  
  if (inputs.distance && inputs.carType) {
    // Handle different transportation types
    let factorKey = '';
    switch(inputs.carType) {
      case 'gasoline':
      case 'diesel':
        factorKey = `car_${inputs.carType.toLowerCase()}_per_km`;
        break;
      case 'bus':
        factorKey = 'bus_per_km';
        break;
      case 'train':
        factorKey = 'train_per_km';
        break;
      case 'motorcycle':
        factorKey = 'motorcycle_per_km';
        break;
      default:
        factorKey = `car_${inputs.carType.toLowerCase()}_per_km`;
    }
    
    const factor = factors.transportation[factorKey] || 0;
    total += inputs.distance * factor;
  }
  
  if (inputs.flightDistance) {
    const factor = factors.transportation.flight_per_km || 0;
    total += inputs.flightDistance * factor;
  }
  
  if (inputs.railDistance) {
    const factor = factors.transportation.rail_per_km || 0;
    total += inputs.railDistance * factor;
  }
  
  return parseFloat(total.toFixed(2));
};

const calculateDigital = (inputs, factors) => {
  let total = 0;
  
  if (inputs.emails) {
    const factor = factors.digital.email_with_attachment || 0;
    total += inputs.emails * factor;
  }
  
  if (inputs.videoCalls) {
    const factor = factors.digital.video_call_1hour || 0;
    total += inputs.videoCalls * factor;
  }
  
  if (inputs.websiteVisits) {
    const factor = factors.digital.website_visit || 0;
    total += inputs.websiteVisits * factor;
  }
  
  if (inputs.socialMedia) {
    const factor = factors.digital.social_media_post || 0;
    total += inputs.socialMedia * factor;
  }
  
  return parseFloat(total.toFixed(2));
};

const calculateEvents = (inputs, factors) => {
  let total = 0;
  
  if (inputs.weddings) {
    const factor = factors.events.wedding_attendance || 0;
    total += inputs.weddings * factor;
  }
  
  if (inputs.concerts) {
    const factor = factors.events.concert_attendance || 0;
    total += inputs.concerts * factor;
  }
  
  if (inputs.conferences) {
    const factor = factors.events.conference_attendance || 0;
    total += inputs.conferences * factor;
  }
  
  return parseFloat(total.toFixed(2));
};

const calculateFood = (inputs, factors) => {
  let total = 0;
  
  if (inputs.beefMeals) {
    const factor = factors.food.beef_meal || 0;
    total += inputs.beefMeals * factor;
  }
  
  if (inputs.chickenMeals) {
    const factor = factors.food.chicken_meal || 0;
    total += inputs.chickenMeals * factor;
  }
  
  if (inputs.vegetarianMeals) {
    const factor = factors.food.vegetarian_meal || 0;
    total += inputs.vegetarianMeals * factor;
  }
  
  if (inputs.veganMeals) {
    const factor = factors.food.vegan_meal || 0;
    total += inputs.veganMeals * factor;
  }
  
  return parseFloat(total.toFixed(2));
};

const calculateHousehold = (inputs, factors) => {
  let total = 0;
  
  if (inputs.electricity) {
    const factor = factors.household.electricity_kwh || 0;
    total += inputs.electricity * factor;
  }
  
  if (inputs.heating && inputs.heating.fuelType && inputs.heating.amount) {
    let factor = 0;
    switch(inputs.heating.fuelType) {
      case 'naturalGas':
        factor = factors.household.natural_gas_kwh || 0;
        break;
      case 'oil':
        factor = factors.household.oil_kwh || 0;
        break;
      case 'propane':
        factor = factors.household.propane_kwh || 0;
        break;
    }
    total += inputs.heating.amount * factor;
  }
  
  if (inputs.water) {
    const factor = factors.household.water_liter || 0;
    total += inputs.water * factor;
  }
  
  if (inputs.waste) {
    const factor = factors.household.waste_kg || 0;
    total += inputs.waste * factor;
  }
  
  return parseFloat(total.toFixed(2));
};

const calculateShipping = (inputs, factors) => {
  let total = 0;
  
  if (inputs.shipping && inputs.shipping.method && inputs.shipping.weight && inputs.shipping.distance) {
    const factorKey = `${inputs.shipping.method.toLowerCase()}_per_kg_km`;
    const factor = factors.shipping[factorKey] || 0;
    total += inputs.shipping.weight * inputs.shipping.distance * factor;
  }
  
  return parseFloat(total.toFixed(2));
};

const calculateTotalEmissions = (inputs) => {
  const factors = getEmissionFactors();
  
  const transportation = calculateTransportation(inputs.transportation || {}, factors);
  const digital = calculateDigital(inputs.digital || {}, factors);
  const events = calculateEvents(inputs.events || {}, factors);
  const food = calculateFood(inputs.food || {}, factors);
  const household = calculateHousehold(inputs.household || {}, factors);
  const shipping = calculateShipping(inputs || {}, factors);
  
  const total = transportation + digital + events + food + household + shipping;
  
  return {
    transportation,
    digital,
    events,
    food,
    household,
    shipping,
    total: parseFloat(total.toFixed(2))
  };
};

export { calculateTotalEmissions };