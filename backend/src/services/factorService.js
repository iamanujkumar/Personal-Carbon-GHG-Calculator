import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the emission factors file
const emissionFactorsPath = path.join(__dirname, '../config/emissionFactors.json');
const emissionFactors = JSON.parse(fs.readFileSync(emissionFactorsPath, 'utf8'));

const getEmissionFactors = () => {
  return emissionFactors;
};

const updateEmissionFactors = (newFactors) => {
  // In a real application, this would update the factors in a database
  // For this MVP, we're using a static JSON file
  return { ...emissionFactors, ...newFactors };
};

export { getEmissionFactors, updateEmissionFactors };