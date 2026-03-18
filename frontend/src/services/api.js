import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Stats
export const getStats = async () => {
  const response = await axios.get(`${API}/stats`, { headers: getAuthHeader() });
  return response.data;
};

// Clients
export const getClients = async (search = '', statut = '') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (statut) params.append('statut', statut);
  
  const response = await axios.get(`${API}/clients?${params.toString()}`, { headers: getAuthHeader() });
  return response.data;
};

export const getClient = async (id) => {
  const response = await axios.get(`${API}/clients/${id}`, { headers: getAuthHeader() });
  return response.data;
};

export const createClient = async (data) => {
  const response = await axios.post(`${API}/clients`, data, { headers: getAuthHeader() });
  return response.data;
};

export const updateClient = async (id, data) => {
  const response = await axios.put(`${API}/clients/${id}`, data, { headers: getAuthHeader() });
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await axios.delete(`${API}/clients/${id}`, { headers: getAuthHeader() });
  return response.data;
};

// Agenda
export const getRdv = async () => {
  const response = await axios.get(`${API}/agenda/rdv`, { headers: getAuthHeader() });
  return response.data;
};

export const getSuivis = async () => {
  const response = await axios.get(`${API}/agenda/suivis`, { headers: getAuthHeader() });
  return response.data;
};

// Export
export const exportClientsCSV = () => {
  const token = localStorage.getItem('token');
  window.open(`${API}/clients/export/csv?authorization=Bearer ${token}`, '_blank');
};
