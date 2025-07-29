import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add agency
export const createAgency = async (agencyData) => {
  return await api.post("/Agency", agencyData);
};

export default api;
