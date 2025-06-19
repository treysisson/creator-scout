const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    baseURL: API_URL,
    endpoints: {
        search: '/api/search/channels',
        creators: '/api/search/creators',
        export: '/api/search/export',
        history: '/api/search/history'
    }
}; 