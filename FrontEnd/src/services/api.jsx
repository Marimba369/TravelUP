import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add agency
export const createAgency = async (agencyData) => {
  return await api.post("/agencies", agencyData);
};

export default api;
