// src/config/axios.js
import axios from 'axios';

// Create an instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Your backend server
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      
      // Handle 401 unauthorized errors (e.g., token expired)
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // You could redirect to login page here if needed
      }
      
      // Transform the error message to be more user-friendly
      const errorMessage = error.response.data.message || 'An error occurred';
      error.message = errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      error.message = 'Server is not responding. Please try again later.';
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;