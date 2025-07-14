const axios = require('axios');

class Logger {
    constructor() {
        this.logEndpoint = 'http://20.244.56.144/evaluation-service/logs';
        this.queue = [];
        this.isProcessing = false;
    }

    async sendLog(stack, level, packageName, message) {
        const logData = {
            stack,
            level,
            package: packageName,
            message: typeof message === 'object' ? JSON.stringify(message) : String(message)
        };

        this.queue.push(logData);
        
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        this.isProcessing = true;
        
        while (this.queue.length > 0) {
            const logData = this.queue.shift();
            
            try {
                await axios.post(this.logEndpoint, logData, {
                    timeout: 5000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                
                console.error('Logging failed:', error.message);
            }
        }
        
        this.isProcessing = false;
    }

    debug(packageName, message) {
        return this.sendLog('backend', 'debug', packageName, message);
    }

    info(packageName, message) {
        return this.sendLog('backend', 'info', packageName, message);
    }

    warn(packageName, message) {
        return this.sendLog('backend', 'warn', packageName, message);
    }

    error(packageName, message) {
        return this.sendLog('backend', 'error', packageName, message);
    }

    fatal(packageName, message) {
        return this.sendLog('backend', 'fatal', packageName, message);
    }
}

class FrontendLogger {
    constructor() {
        this.logEndpoint = 'http://20.244.56.144/evaluation-service/logs';
        this.queue = [];
        this.isProcessing = false;
    }

    async sendLog(level, packageName, message) {
        const logData = {
            stack: 'frontend',
            level,
            package: packageName,
            message: typeof message === 'object' ? JSON.stringify(message) : String(message)
        };

        this.queue.push(logData);
        
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        this.isProcessing = true;
        
        while (this.queue.length > 0) {
            const logData = this.queue.shift();
            
            try {
                const response = await fetch(this.logEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(logData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Logging failed:', error.message);
            }
        }
        
        this.isProcessing = false;
    }

    debug(packageName, message) {
        return this.sendLog('debug', packageName, message);
    }

    info(packageName, message) {
        return this.sendLog('info', packageName, message);
    }

    warn(packageName, message) {
        return this.sendLog('warn', packageName, message);
    }

    error(packageName, message) {
        return this.sendLog('error', packageName, message);
    }

    fatal(packageName, message) {
        return this.sendLog('fatal', packageName, message);
    }
}

const loggingMiddleware = (logger) => {
    return (req, res, next) => {
        const start = Date.now();
        
        logger.info('middleware', `${req.method} ${req.path} - Request received`);
        
        const originalEnd = res.end;
        res.end = function(chunk, encoding) {
            const duration = Date.now() - start;
            logger.info('middleware', `${req.method} ${req.path} - Response sent (${res.statusCode}) - ${duration}ms`);
            originalEnd.call(this, chunk, encoding);
        };
        
        next();
    };
};

module.exports = {
    Logger,
    FrontendLogger,
    loggingMiddleware
};
