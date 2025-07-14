import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Grid,
    Alert,
    Button,
    IconButton,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ContentCopy as CopyIcon,
    Launch as LaunchIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { logger } from '../services/logger';

const StatisticsCard = ({ urls, onRefresh, onClear }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [urlDetails, setUrlDetails] = useState({});
    const [loading, setLoading] = useState({});
    const [error, setError] = useState('');

    const fetchUrlDetails = async (shortcode) => {
        if (urlDetails[shortcode]) return; 
        
        setLoading(prev => ({ ...prev, [shortcode]: true }));
        
        try {
            logger.info('component', `Fetching details for shortcode: ${shortcode}`);
            const details = await apiService.getUrlDetails(shortcode);
            setUrlDetails(prev => ({ ...prev, [shortcode]: details }));
            logger.info('component', `Successfully fetched details for: ${shortcode}`);
        } catch (error) {
            logger.error('component', `Failed to fetch details for ${shortcode}: ${error.message}`);
            setError(`Failed to fetch details for ${shortcode}`);
        } finally {
            setLoading(prev => ({ ...prev, [shortcode]: false }));
        }
    };

    const refreshUrlDetails = async (shortcode) => {
        setUrlDetails(prev => {
            const newDetails = { ...prev };
            delete newDetails[shortcode];
            return newDetails;
        });
        await fetchUrlDetails(shortcode);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            logger.info('component', 'Text copied to clipboard');
        } catch (error) {
            logger.error('component', `Failed to copy to clipboard: ${error.message}`);
        }
    };

    const openUrl = (url) => {
        window.open(url, '_blank');
        logger.info('component', `Opened URL in new tab: ${url}`);
    };

    const extractShortcode = (shortLink) => {
        try {
            const url = new URL(shortLink);
            return url.pathname.substring(1); 
        } catch (error) {
            logger.error('component', `Failed to extract shortcode from: ${shortLink}`);
            return '';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const isExpired = (expiryDate) => {
        return new Date() > new Date(expiryDate);
    };

    if (urls.length === 0) {
        return (
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                        URL Statistics
                    </Typography>
                    
                    <Alert severity="info">
                        No shortened URLs found. Create some URLs first to see statistics here.
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={3}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                        URL Statistics ({urls.length})
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={onRefresh}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            Refresh
                        </Button>
                        
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={onClear}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            Clear All
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    {urls.map((url, index) => {
                        const shortcode = extractShortcode(url.shortLink);
                        const details = urlDetails[shortcode];
                        const isLoadingDetails = loading[shortcode];
                        
                        return (
                            <Grid item xs={12} key={url.id || index}>
                                <Accordion>
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        onClick={() => fetchUrlDetails(shortcode)}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="h6" sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
                                                    {url.shortLink}
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Copy Short URL">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(url.shortLink);
                                                            }}
                                                        >
                                                            <CopyIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    
                                                    <Tooltip title="Open Short URL">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openUrl(url.shortLink);
                                                            }}
                                                        >
                                                            <LaunchIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                                → {url.originalUrl}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                <Chip 
                                                    label={isExpired(url.expiry) ? 'Expired' : 'Active'} 
                                                    color={isExpired(url.expiry) ? 'error' : 'success'} 
                                                    size="small" 
                                                />
                                                
                                                {details && (
                                                    <Chip 
                                                        label={`${details.clicks.length} clicks`} 
                                                        color="primary" 
                                                        size="small" 
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    
                                    <AccordionDetails>
                                        {isLoadingDetails ? (
                                            <Typography>Loading details...</Typography>
                                        ) : details ? (
                                            <Box>
                                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="primary">
                                                            Created At
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {formatDate(details.createdAt)}
                                                        </Typography>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="primary">
                                                            Expires At
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {formatDate(details.expiry)}
                                                        </Typography>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="primary">
                                                            Total Clicks
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {details.clicks.length}
                                                        </Typography>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={6}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<RefreshIcon />}
                                                            onClick={() => refreshUrlDetails(shortcode)}
                                                        >
                                                            Refresh Details
                                                        </Button>
                                                    </Grid>
                                                </Grid>

                                                {details.clicks.length > 0 && (
                                                    <Box>
                                                        <Typography variant="h6" gutterBottom color="primary">
                                                            Click History
                                                        </Typography>
                                                        
                                                        <TableContainer component={Paper} variant="outlined">
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Timestamp</TableCell>
                                                                        <TableCell>Location</TableCell>
                                                                        <TableCell>Referrer</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {details.clicks.slice().reverse().map((click, clickIndex) => (
                                                                        <TableRow key={clickIndex}>
                                                                            <TableCell>
                                                                                {formatDate(click.timestamp)}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {click.location || 'Unknown'}
                                                                            </TableCell>
                                                                            <TableCell sx={{ wordBreak: 'break-all' }}>
                                                                                {click.referrer || 'Direct'}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Box>
                                                )}
                                                
                                                {details.clicks.length === 0 && (
                                                    <Alert severity="info">
                                                        No clicks recorded yet for this URL.
                                                    </Alert>
                                                )}
                                            </Box>
                                        ) : (
                                            <Alert severity="error">
                                                Failed to load URL details. Try refreshing.
                                            </Alert>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        );
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default StatisticsCard;
