import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add agency
export const createAgency = async (agencyData) => {
  return await api.post("/Agency", agencyData);
};

// add request
export const createTravelRequest = async (requestData) => {
  return await api.post("/request", requestData);
}
// add quote
export const CreateQuoteRequest = async ( requestData ) => {
  return await api.post("/Quote", requestData);
}

// Get all agencies
export const getAllAgencies = async () => {
  return await api.get("/Agency");
};

// Get agency by ID
export const getAgencyById = async (id) => {
  return await api.get(`/Agency/${id}`);
};

// Update agency
export const updateAgency = async (id, updatedData) => {
  return await api.put(`/Agency/${id}`, updatedData);
};

// Delete agency (caso necessário)
export const deleteAgency = async (id) => {
  return await api.delete(`/Agency/${id}`);
};

// update travel request, implementar logica no backend
export const updateTravelRequest = async (id, requestData) => {
  return await api.put(`/request/${id}`, requestData);
};

export default api;
