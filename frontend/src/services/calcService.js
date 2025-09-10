import apiClient from './apiClient';

const calcService = {
  calculateEmissions: async (data, isPublic = true) => {
    try {
      if (isPublic) {
        // For demo purposes, use the public endpoint
        const response = await apiClient.post('/calculations/public', data);
        return response.data;
      } else {
        // For authenticated users
        const response = await apiClient.post('/calculations', data);
        return response.data;
      }
    } catch (error) {
      console.error('Error calculating emissions:', error);
      throw error;
    }
  },

  getCalculations: async () => {
    try {
      const response = await apiClient.get('/calculations');
      return response.data;
    } catch (error) {
      console.error('Error fetching calculations:', error);
      throw error;
    }
  },

  getCalculationById: async (id) => {
    try {
      const response = await apiClient.get(`/calculations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching calculation ${id}:`, error);
      throw error;
    }
  }
};

export default calcService;