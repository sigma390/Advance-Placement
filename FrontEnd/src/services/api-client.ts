import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', // This will route requests through the Vite proxy
});

export default axiosInstance;
