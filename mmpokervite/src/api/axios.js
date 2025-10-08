import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
});

// Global interceptor to catch expired sessions or server crashes
// Check axios documentation for more info
api.interceptors.response.use(
    // Return the response if successful (implicit return)
    response => response,

    // Handle errors
    error => {
        // Handle server unreachable
        if (!error.response || error.code === 'ERR_NETWORK') {
            console.error('⚠️ Server unreachable or stopped.');

            // Here, we are triggering a custom event that we will listen to in UserContext.jsx
            window.dispatchEvent(new Event('serverDown'));
        }

        // Handle unauthorized (expired session)
        if (error.response && error.response.status === 401) {
            console.warn('⚠️ Session expired, logging out.');

            // Here, we are triggering a custom event that we will listen to in UserContext.jsx
            window.dispatchEvent(new Event('sessionExpired'));
        }

        // Always reject the promise so we can handle the error if needed
        return Promise.reject(error);
    }
);

export default api;