import axios from 'axios';

const port = 3300
const api = axios.create({
    baseURL: `http://localhost:${port}/api`,
});

export const fetchDevices = async () => {
    const response = await api.get('/devices');
    return response.data;
};

export const fetchDeviceById = async (id: string) => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
};

export const createDevice = async (device: any) => {
    const response = await api.post('/devices', device);
    return response.data;
};

export const updateDevice = async (id: string, device: any) => {
    const response = await api.put(`/devices/${id}`, device);
    return response.data;
};

export const deleteDevice = async (id: string) => {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
};

export const fetchDashboardStats = async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
};

export const fetchRecentActivity = async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
};

export default api;
