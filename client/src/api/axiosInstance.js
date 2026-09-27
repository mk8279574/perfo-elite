import axios from 'axios';

const axiosInstance = axios.create({
 baseURL: 'https://perfo-elite-e5xc.onrender.com/api',
  withCredentials: true
});

export default axiosInstance;