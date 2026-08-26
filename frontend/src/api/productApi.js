import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/products";

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`);
  return response.data;
};