import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
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
    (response: AxiosResponse) => response,
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

// Types
export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    _id: string;
    userId: string;
    name: string;
    description: string;
    apiToken: string;
    baseUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface Module {
    _id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    schema: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectModule {
    _id: string;
    projectId: string;
    moduleId: Module;
    configuration: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface ComponentTemplate {
    _id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    icon: string;
    fieldSchema: {
        fields: Array<{
            name: string;
            type: string;
            label: string;
            required: boolean;
            default?: any;
            placeholder?: string;
            options?: string[];
        }>;
    };
    previewImage: string;
    defaultConfig: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectComponent {
    _id: string;
    projectId: string;
    templateId: ComponentTemplate;
    order: number;
    isActive: boolean;
    configuration: {
        layout?: string;
        colors?: {
            primary?: string;
            secondary?: string;
            background?: string;
            text?: string;
        };
        spacing?: Record<string, any>;
        customCSS?: string;
    };
    content: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

// Auth API
export const authAPI = {
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/api/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/api/auth/login', data),
    getMe: () => api.get('/api/auth/me'),
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/api/projects'),
    create: (data: { name: string; description?: string }) =>
        api.post('/api/projects', data),
    getOne: (id: string) => api.get(`/api/projects/${id}`),
    update: (id: string, data: { name?: string; description?: string }) =>
        api.put(`/api/projects/${id}`, data),
    delete: (id: string) => api.delete(`/api/projects/${id}`),
    regenerateToken: (id: string) => api.post(`/api/projects/${id}/regenerate-token`),
};

// Modules API
export const modulesAPI = {
    getAll: () => api.get('/api/modules'),
    getOne: (id: string) => api.get(`/api/modules/${id}`),
    getProjectModules: (projectId: string) =>
        api.get(`/api/projects/${projectId}/modules`),
    enableModule: (projectId: string, data: { moduleId: string; configuration?: Record<string, any> }) =>
        api.post(`/api/projects/${projectId}/modules`, data),
    disableModule: (projectId: string, moduleId: string) =>
        api.delete(`/api/projects/${projectId}/modules/${moduleId}`),
};

// Component Templates API
export const componentTemplatesAPI = {
    getAll: () => api.get('/api/component-templates'),
    getOne: (id: string) => api.get(`/api/component-templates/${id}`),
};

// Project Components API
export const projectComponentsAPI = {
    getAll: (projectId: string) =>
        api.get(`/api/projects/${projectId}/components`),
    create: (projectId: string, data: { templateId: string; content?: Record<string, any>; configuration?: Record<string, any> }) =>
        api.post(`/api/projects/${projectId}/components`, data),
    update: (projectId: string, componentId: string, data: { content?: Record<string, any>; configuration?: Record<string, any>; isActive?: boolean }) =>
        api.put(`/api/projects/${projectId}/components/${componentId}`, data),
    delete: (projectId: string, componentId: string) =>
        api.delete(`/api/projects/${projectId}/components/${componentId}`),
    reorder: (projectId: string, componentIds: string[]) =>
        api.put(`/api/projects/${projectId}/components/reorder`, { componentIds }),
};

// Dynamic Data API (for admin panel)
export const dynamicDataAPI = {
    getAll: (projectToken: string, moduleName: string) =>
        axios.get(`${API_URL}/api/v1/${projectToken}/${moduleName}`),
    create: (projectToken: string, moduleName: string, data: Record<string, any>) =>
        axios.post(`${API_URL}/api/v1/${projectToken}/${moduleName}`, data),
    getOne: (projectToken: string, moduleName: string, id: string) =>
        axios.get(`${API_URL}/api/v1/${projectToken}/${moduleName}/${id}`),
    update: (projectToken: string, moduleName: string, id: string, data: Record<string, any>) =>
        axios.put(`${API_URL}/api/v1/${projectToken}/${moduleName}/${id}`, data),
    delete: (projectToken: string, moduleName: string, id: string) =>
        axios.delete(`${API_URL}/api/v1/${projectToken}/${moduleName}/${id}`),
};

export default api;
