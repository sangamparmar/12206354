import axios from 'axios';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:5000';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                logger.info('api', `Making ${config.method.toUpperCase()} request to ${config.url}`);
                return config;
            },
            (error) => {
                logger.error('api', `Request error: ${error.message}`);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => {
                logger.info('api', `Received response from ${response.config.url} - Status: ${response.status}`);
                return response;
            },
            (error) => {
                const message = error.response?.data?.error || error.message;
                logger.error('api', `Response error: ${message}`);
                return Promise.reject(error);
            }
        );
    }

    async createShortUrl(urlData) {
        try {
            logger.info('api', `Creating short URL for: ${urlData.url}`);
            const response = await this.api.post('/shorturls', urlData);
            logger.info('api', 'Short URL created successfully');
            return response.data;
        } catch (error) {
            logger.error('api', `Failed to create short URL: ${error.response?.data?.error || error.message}`);
            throw error;
        }
    }

    async getUrlDetails(shortcode) {
        try {
            logger.info('api', `Getting details for shortcode: ${shortcode}`);
            const response = await this.api.get(`/shorturls/${shortcode}`);
            logger.info('api', 'URL details retrieved successfully');
            return response.data;
        } catch (error) {
            logger.error('api', `Failed to get URL details: ${error.response?.data?.error || error.message}`);
            throw error;
        }
    }

    async healthCheck() {
        try {
            logger.info('api', 'Performing health check');
            const response = await this.api.get('/health');
            logger.info('api', 'Health check successful');
            return response.data;
        } catch (error) {
            logger.error('api', `Health check failed: ${error.message}`);
            throw error;
        }
    }
}

export const apiService = new ApiService();
