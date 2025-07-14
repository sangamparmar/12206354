const axios = require('axios');

class Logger {
    constructor() {
        this.logEndpoint = 'http://20.244.56.144/evaluation-service/logs';
        this.queue = [];
        this.isProcessing = false;
        this.bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYW5nYW1wYXJtYXI5NEBnbWFpbC5jb20iLCJleHAiOjE3NTI0NzI2MjMsImlhdCI6MTc1MjQ3MTcyMywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjA0YWQ5OTcwLTJjMWMtNGQ3MC1hNjlkLTE2MTgzMjgyNDU2ZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNhbmdhbSBwYXJtYXIiLCJzdWIiOiI5MGQ1NmMwYS0xYWVjLTRhZjEtYTMxMC02NmEyZDk0YWUzZDEifSwiZW1haWwiOiJzYW5nYW1wYXJtYXI5NEBnbWFpbC5jb20iLCJuYW1lIjoic2FuZ2FtIHBhcm1hciIsInJvbGxObyI6IjEyMjA2MzU0IiwiYWNjZXNzQ29kZSI6IkNaeXBRSyIsImNsaWVudElEIjoiOTBkNTZjMGEtMWFlYy00YWYxLWEzMTAtNjZhMmQ5NGFlM2QxIiwiY2xpZW50U2VjcmV0IjoiYkF1cmZWU0hyTk5BbnFUdiJ9.e-9YWRA6PVEi3M23Y6hEJwVEF40fgmwUYSfId8ZzEXI';
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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.bearerToken}`
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
    loggingMiddleware
};
