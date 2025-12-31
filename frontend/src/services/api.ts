import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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

export const api = {
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

    saveToHistory: async (data: { title: string; description?: string; weights: WeightRequest }) => {
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
