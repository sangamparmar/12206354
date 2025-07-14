import React, { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    Chip,
    IconButton,
    Tooltip,
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ContentCopy as CopyIcon,
    Launch as LaunchIcon
} from '@mui/icons-material';
import validator from 'validator';
import { logger } from '../services/logger';

const UrlForm = ({ onSubmit, loading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [urls, setUrls] = useState([
        { id: 1, url: '', validity: '', shortcode: '', errors: {} }
    ]);

    const [results, setResults] = useState([]);
    const [globalError, setGlobalError] = useState('');

    const addUrlField = () => {
        if (urls.length < 5) {
            const newId = Math.max(...urls.map(u => u.id)) + 1;
            setUrls([...urls, { id: newId, url: '', validity: '', shortcode: '', errors: {} }]);
            logger.info('component', `Added new URL field. Total fields: ${urls.length + 1}`);
        }
    };

    const removeUrlField = (id) => {
        if (urls.length > 1) {
            setUrls(urls.filter(url => url.id !== id));
            logger.info('component', `Removed URL field. Total fields: ${urls.length - 1}`);
        }
    };

    const updateUrl = (id, field, value) => {
        setUrls(urls.map(url => 
            url.id === id 
                ? { ...url, [field]: value, errors: { ...url.errors, [field]: '' } }
                : url
        ));
    };

    const validateUrl = (urlData) => {
        const errors = {};

        if (!urlData.url.trim()) {
            errors.url = 'URL is required';
        } else if (!validator.isURL(urlData.url.trim())) {
            errors.url = 'Please enter a valid URL';
        }

        if (urlData.validity && (!Number.isInteger(Number(urlData.validity)) || Number(urlData.validity) <= 0)) {
            errors.validity = 'Validity must be a positive integer';
        }

        if (urlData.shortcode && !/^[a-zA-Z0-9_-]+$/.test(urlData.shortcode)) {
            errors.shortcode = 'Shortcode must contain only alphanumeric characters, hyphens, and underscores';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        logger.info('component', 'Submitting URL form');
        
        setGlobalError('');
        setResults([]);

        const validatedUrls = urls.map(url => ({
            ...url,
            errors: validateUrl(url)
        }));

        setUrls(validatedUrls);

        const hasErrors = validatedUrls.some(url => Object.keys(url.errors).length > 0);
        
        if (hasErrors) {
            setGlobalError('Please fix the validation errors above');
            logger.warn('component', 'Form submission failed due to validation errors');
            return;
        }

        const validUrls = validatedUrls.filter(url => url.url.trim());

        if (validUrls.length === 0) {
            setGlobalError('Please enter at least one URL');
            return;
        }

        try {
            const results = [];
            
            for (const urlData of validUrls) {
                const payload = {
                    url: urlData.url.trim(),
                };
                
                if (urlData.validity) {
                    payload.validity = parseInt(urlData.validity);
                }
                
                if (urlData.shortcode) {
                    payload.shortcode = urlData.shortcode.trim();
                }

                logger.info('component', `Processing URL: ${payload.url}`);
                
                try {
                    const result = await onSubmit(payload);
                    results.push({
                        ...result,
                        originalUrl: payload.url,
                        success: true
                    });
                    logger.info('component', `Successfully processed URL: ${payload.url}`);
                } catch (error) {
                    results.push({
                        originalUrl: payload.url,
                        success: false,
                        error: error.response?.data?.error || error.message
                    });
                    logger.error('component', `Failed to process URL: ${payload.url} - ${error.message}`);
                }
            }

            setResults(results);
            
            if (results.every(r => r.success)) {
                setUrls([{ id: 1, url: '', validity: '', shortcode: '', errors: {} }]);
                logger.info('component', 'Form cleared after successful submission');
            }
            
        } catch (error) {
            setGlobalError('An unexpected error occurred');
            logger.error('component', `Unexpected error during form submission: ${error.message}`);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            logger.info('component', 'URL copied to clipboard');
        } catch (error) {
            logger.error('component', `Failed to copy to clipboard: ${error.message}`);
        }
    };

    const openUrl = (url) => {
        window.open(url, '_blank');
        logger.info('component', `Opened URL in new tab: ${url}`);
    };

    return (
        <Card elevation={3}>
            <CardContent>
                <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                    Shorten Your URLs
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Enter up to 5 URLs to shorten. Custom shortcodes and validity periods are optional.
                </Typography>

                <form onSubmit={handleSubmit}>
                    {urls.map((urlData, index) => (
                        <Card 
                            key={urlData.id} 
                            variant="outlined" 
                            sx={{ mb: 2, p: 2 }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    URL #{index + 1}
                                </Typography>
                                {urls.length > 1 && (
                                    <IconButton 
                                        onClick={() => removeUrlField(urlData.id)}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Long URL *"
                                        placeholder="https://example.com/very/long/url"
                                        value={urlData.url}
                                        onChange={(e) => updateUrl(urlData.id, 'url', e.target.value)}
                                        error={!!urlData.errors.url}
                                        helperText={urlData.errors.url}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Validity (minutes)"
                                        placeholder="30"
                                        type="number"
                                        value={urlData.validity}
                                        onChange={(e) => updateUrl(urlData.id, 'validity', e.target.value)}
                                        error={!!urlData.errors.validity}
                                        helperText={urlData.errors.validity || "Default: 30 minutes"}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Custom Shortcode"
                                        placeholder="my-custom-link"
                                        value={urlData.shortcode}
                                        onChange={(e) => updateUrl(urlData.id, 'shortcode', e.target.value)}
                                        error={!!urlData.errors.shortcode}
                                        helperText={urlData.errors.shortcode || "Optional: alphanumeric, _, -"}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                    ))}

                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        {urls.length < 5 && (
                            <Button
                                variant="outlined"
                                onClick={addUrlField}
                                size={isMobile ? 'small' : 'medium'}
                            >
                                Add Another URL ({urls.length}/5)
                            </Button>
                        )}
                        
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            size={isMobile ? 'small' : 'medium'}
                            sx={{ ml: 'auto' }}
                        >
                            {loading ? 'Processing...' : 'Shorten URLs'}
                        </Button>
                    </Box>

                    {globalError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {globalError}
                        </Alert>
                    )}
                </form>

                {results.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Results
                        </Typography>
                        
                        {results.map((result, index) => (
                            <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                                {result.success ? (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Chip 
                                                label="Success" 
                                                color="success" 
                                                size="small" 
                                                sx={{ mr: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {result.originalUrl}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography variant="body1" sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
                                                {result.shortLink}
                                            </Typography>
                                            
                                            <Tooltip title="Copy URL">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => copyToClipboard(result.shortLink)}
                                                >
                                                    <CopyIcon />
                                                </IconButton>
                                            </Tooltip>
                                            
                                            <Tooltip title="Open URL">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => openUrl(result.shortLink)}
                                                >
                                                    <LaunchIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        
                                        <Typography variant="caption" color="text.secondary">
                                            Expires: {new Date(result.expiry).toLocaleString()}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Chip 
                                                label="Error" 
                                                color="error" 
                                                size="small" 
                                                sx={{ mr: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {result.originalUrl}
                                            </Typography>
                                        </Box>
                                        
                                        <Alert severity="error">
                                            {result.error}
                                        </Alert>
                                    </Box>
                                )}
                            </Card>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default UrlForm;
