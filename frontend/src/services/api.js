import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
    getMe: () => api.get('/api/auth/me'),
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/api/projects'),
    create: (data) => api.post('/api/projects', data),
    getOne: (id) => api.get(`/api/projects/${id}`),
    update: (id, data) => api.put(`/api/projects/${id}`, data),
    delete: (id) => api.delete(`/api/projects/${id}`),
    regenerateToken: (id) => api.post(`/api/projects/${id}/regenerate-token`),
};

// Modules API
export const modulesAPI = {
    getAll: () => api.get('/api/modules'),
    getOne: (id) => api.get(`/api/modules/${id}`),
    getProjectModules: (projectId) => api.get(`/api/projects/${projectId}/modules`),
    enableModule: (projectId, data) => api.post(`/api/projects/${projectId}/modules`, data),
    disableModule: (projectId, moduleId) => api.delete(`/api/projects/${projectId}/modules/${moduleId}`),
};

// Dynamic Data API (for admin panel)
export const dynamicDataAPI = {
    getAll: (projectToken, moduleName) =>
        axios.get(`${API_URL}/api/v1/${projectToken}/${moduleName}`),
    create: (projectToken, moduleName, data) =>
        axios.post(`${API_URL}/api/v1/${projectToken}/${moduleName}`, data),
    getOne: (projectToken, moduleName, id) =>
        axios.get(`${API_URL}/api/v1/${projectToken}/${moduleName}/${id}`),
    update: (projectToken, moduleName, id, data) =>
        axios.put(`${API_URL}/api/v1/${projectToken}/${moduleName}/${id}`, data),
    delete: (projectToken, moduleName, id) =>
        axios.delete(`${API_URL}/api/v1/${projectToken}/${moduleName}/${id}`),
};

export default api;
