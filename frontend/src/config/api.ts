import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // This will be replaced with the actual backend URL
});

export default api; 