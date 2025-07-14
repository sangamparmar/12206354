import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { LinkOutlined } from '@mui/icons-material';
import { logger } from '../services/logger';

const Navigation = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const handleNavigation = (path) => {
        logger.info('component', `Navigating to: ${path}`);
    };

    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar>
                <LinkOutlined sx={{ mr: 2 }} />
                <Typography
                    variant={isMobile ? "h6" : "h5"}
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: 'bold' }}
                >
                    URL Shortener
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/"
                        onClick={() => handleNavigation('/')}
                        variant={location.pathname === '/' ? 'outlined' : 'text'}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Shorten URLs
                    </Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/statistics"
                        onClick={() => handleNavigation('/statistics')}
                        variant={location.pathname === '/statistics' ? 'outlined' : 'text'}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Statistics
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;
