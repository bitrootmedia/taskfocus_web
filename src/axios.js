import axios from 'axios';
import config from './config/index.js';

const instance = axios.create({
    baseURL: config.BASE_API_URL // initial base URL
});

export default instance;
