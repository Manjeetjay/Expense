import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors here
        if (error.response?.status === 401) {
            // Handle unauthorized
        }
        return Promise.reject(error);
    }
);

export { api };
export const licenseService = {
    checkLicenseStatus: async () => {
        try {
            const response = await api.get('/license/check');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    registerLicense: async (licenseKey) => {
        try {
            const response = await api.post('/license/register', { licenseKey });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    validateLicense: async (licenseKey) => {
        try {
            const response = await api.post('/license/validate', { licenseKey });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 