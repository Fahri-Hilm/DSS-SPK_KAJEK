import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Token management
const TOKEN_KEY = 'jwt_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Add authorization header to all requests if token exists
axios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export interface DataItem {
    No?: number;
    Vendor: string;
    'Nama Paket (Plan)': string;
    CPU_Level: number | string;
    RAM_Level: number | string;
    DiskIO_Level: number | string;
    Price_Level: number | string;
    CPU_val?: number;
    RAM_val?: number;
    DiskIO_val?: number;
    Price_val?: number;
    Score?: number;
    Rank?: number;
}

export interface WeightRequest {
    cpu: number;
    ram: number;
    disk: number;
    price: number;
}

export interface VendorRequest {
    vendor: string;
    nama_paket: string;
    cpu_level: number;
    ram_level: number;
    diskio_level: number;
    price_level: number;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: {
        username: string;
        email: string;
        display_name: string;
    };
}

export interface UserProfile {
    username: string;
    email: string;
    display_name: string;
}

export const api = {
    // Authentication
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post<LoginResponse>(`${API_URL}/login`, { username, password });
        if (response.data.access_token) {
            setToken(response.data.access_token);
        }
        return response.data;
    },

    logout: () => {
        clearToken();
    },

    getProfile: async (): Promise<UserProfile> => {
        const response = await axios.get<UserProfile>(`${API_URL}/profile`);
        return response.data;
    },

    updateProfile: async (email: string, display_name: string) => {
        const response = await axios.put(`${API_URL}/profile`, { email, display_name });
        return response.data;
    },

    changePassword: async (old_password: string, new_password: string) => {
        const response = await axios.post(`${API_URL}/change-password`, { old_password, new_password });
        return response.data;
    },

    // Vendor data
    getData: async () => {
        const response = await axios.get<DataItem[]>(`${API_URL}/data`);
        return response.data;
    },

    addVendor: async (vendor: VendorRequest) => {
        const response = await axios.post(`${API_URL}/data`, vendor);
        return response.data;
    },

    deleteVendor: async (vendorNo: number) => {
        const response = await axios.delete(`${API_URL}/data/${vendorNo}`);
        return response.data;
    },

    updateVendor: async (vendorNo: number, vendor: VendorRequest) => {
        const response = await axios.put(`${API_URL}/data/${vendorNo}`, vendor);
        return response.data;
    },

    calculate: async (weights: WeightRequest) => {
        const response = await axios.post(`${API_URL}/calculate`, weights);
        return response.data;
    },

    getHistory: async () => {
        const response = await axios.get(`${API_URL}/history`);
        return response.data;
    },

    saveToHistory: async (data: { title: string; description?: string; weights: WeightRequest; tags?: string[] }) => {
        const response = await axios.post(`${API_URL}/history`, data);
        return response.data;
    },

    deleteHistory: async (id: number) => {
        const response = await axios.delete(`${API_URL}/history/${id}`);
        return response.data;
    },

    clearHistory: async () => {
        const response = await axios.delete(`${API_URL}/history`);
        return response.data;
    }
};
