import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Navigation from './components/Navigation';
import UrlShortener from './pages/UrlShortener';
import Statistics from './pages/Statistics';
import { logger } from './services/logger';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

function App() {
    useEffect(() => {
        logger.info('component', 'Application started');
        
        const handleError = (event) => {
            logger.error('component', `Unhandled error: ${event.error?.message || event.message}`);
        };
        
        const handleUnhandledRejection = (event) => {
            logger.error('component', `Unhandled promise rejection: ${event.reason}`);
        };
        
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        
        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navigation />
                    
                    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5' }}>
                        <Routes>
                            <Route path="/" element={<UrlShortener />} />
                            <Route path="/statistics" element={<Statistics />} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;
