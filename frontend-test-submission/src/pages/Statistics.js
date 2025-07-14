import React, { useEffect } from 'react';
import {
    Container,
    Typography,
    Box
} from '@mui/material';
import StatisticsCard from '../components/StatisticsCard';
import { useUrls } from '../hooks/useLocalStorage';
import { logger } from '../services/logger';

const Statistics = () => {
    const { urls, clearUrls } = useUrls();

    useEffect(() => {
        logger.info('component', 'Statistics page loaded');
    }, []);

    const handleRefresh = () => {
        logger.info('component', 'Refreshing statistics page');
        window.location.reload();
    };

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear all URL statistics? This action cannot be undone.')) {
            logger.info('component', 'Clearing all URL statistics');
            clearUrls();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">
                    Statistics
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    View and manage your shortened URLs
                </Typography>
            </Box>

            <StatisticsCard 
                urls={urls} 
                onRefresh={handleRefresh}
                onClear={handleClear}
            />
        </Container>
    );
};

export default Statistics;
