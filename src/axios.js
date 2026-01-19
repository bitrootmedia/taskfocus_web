import axios from 'axios';
import config from './config/index.js';

// Also set on defaults for code that uses axios.defaults directly
axios.defaults.withCredentials = true;

const instance = axios.create({
    baseURL: config.BASE_API_URL, // initial base URL
    withCredentials: true // send cookies with requests
});

// Helper to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Add CSRF token to all requests
instance.interceptors.request.use((config) => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

// Fetch CSRF token from backend (call this before login)
export async function fetchCsrfToken() {
    await instance.get('/csrf/');
}

export default instance;
