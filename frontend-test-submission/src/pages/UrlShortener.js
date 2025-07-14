import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Alert
} from '@mui/material';
import UrlForm from '../components/UrlForm';
import { apiService } from '../services/api';
import { useUrls } from '../hooks/useLocalStorage';
import { logger } from '../services/logger';

const UrlShortener = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { addUrl } = useUrls();

    const handleSubmit = async (urlData) => {
        setLoading(true);
        setError('');
        
        try {
            logger.info('component', 'Submitting URL for shortening');
            
            const result = await apiService.createShortUrl(urlData);
            
            // Store in session storage for statistics
            addUrl({
                ...result,
                originalUrl: urlData.url,
                shortcode: result.shortLink.split('/').pop()
            });
            
            logger.info('component', 'URL shortened successfully');
            return result;
            
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(errorMessage);
            logger.error('component', `Error shortening URL: ${errorMessage}`);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
                    URL Shortener
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Transform long URLs into short, shareable links
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <UrlForm onSubmit={handleSubmit} loading={loading} />
        </Container>
    );
};

export default UrlShortener;
