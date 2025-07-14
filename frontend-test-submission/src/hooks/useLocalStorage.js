import { useState, useEffect } from 'react';
import { logger } from '../services/logger';

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            logger.debug('hook', `Reading from sessionStorage - key: ${key}`);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            logger.error('hook', `Error reading from sessionStorage: ${error.message}`);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            logger.debug('hook', `Saved to sessionStorage - key: ${key}`);
        } catch (error) {
            logger.error('hook', `Error saving to sessionStorage: ${error.message}`);
        }
    };

    return [storedValue, setValue];
};

export const useUrls = () => {
    const [urls, setUrls] = useLocalStorage('shortenedUrls', []);

    const addUrl = (urlData) => {
        logger.info('hook', 'Adding new URL to storage');
        setUrls(prevUrls => [...prevUrls, { ...urlData, id: Date.now() }]);
    };

    const updateUrl = (shortcode, updates) => {
        logger.info('hook', `Updating URL with shortcode: ${shortcode}`);
        setUrls(prevUrls => 
            prevUrls.map(url => 
                url.shortcode === shortcode ? { ...url, ...updates } : url
            )
        );
    };

    const clearUrls = () => {
        logger.info('hook', 'Clearing all URLs from storage');
        setUrls([]);
    };

    return { urls, addUrl, updateUrl, clearUrls };
};
