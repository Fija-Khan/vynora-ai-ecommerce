import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/products";

// Get products with filters
export const getProducts = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/`, {
    params: filters,
  });

  return response.data;
};

// Get categories
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`);

  return response.data;
};