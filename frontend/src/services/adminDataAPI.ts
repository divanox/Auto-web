import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface AdminDataItem {
    _id: string;
    projectId: string;
    moduleId: string | null;
    data: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export const adminDataAPI = {
    // Get all items of a specific type
    getAll: (projectId: string, dataType: string) => {
        return axios.get(`${API_URL}/api/projects/${projectId}/admin/data/${dataType}`, {
            headers: getAuthHeader()
        });
    },

    // Get a single item
    getOne: (projectId: string, dataType: string, itemId: string) => {
        return axios.get(`${API_URL}/api/projects/${projectId}/admin/data/${dataType}/${itemId}`, {
            headers: getAuthHeader()
        });
    },

    // Create a new item
    create: (projectId: string, dataType: string, data: Record<string, any>) => {
        return axios.post(`${API_URL}/api/projects/${projectId}/admin/data/${dataType}`, data, {
            headers: getAuthHeader()
        });
    },

    // Update an item
    update: (projectId: string, dataType: string, itemId: string, data: Record<string, any>) => {
        return axios.put(`${API_URL}/api/projects/${projectId}/admin/data/${dataType}/${itemId}`, data, {
            headers: getAuthHeader()
        });
    },

    // Delete an item
    delete: (projectId: string, dataType: string, itemId: string) => {
        return axios.delete(`${API_URL}/api/projects/${projectId}/admin/data/${dataType}/${itemId}`, {
            headers: getAuthHeader()
        });
    },

    // Upload an image
    uploadImage: (projectId: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        return axios.post(`${API_URL}/api/projects/${projectId}/admin/upload`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
