class FrontendLogger {
    constructor() {
        this.logEndpoint = 'http://20.244.56.144/evaluation-service/logs';
        this.queue = [];
        this.isProcessing = false;
        // Your Bearer token from the auth response
        this.bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYW5nYW1wYXJtYXI5NEBnbWFpbC5jb20iLCJleHAiOjE3NTI0NzI2MjMsImlhdCI6MTc1MjQ3MTcyMywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjA0YWQ5OTcwLTJjMWMtNGQ3MC1hNjlkLTE2MTgzMjgyNDU2ZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNhbmdhbSBwYXJtYXIiLCJzdWIiOiI5MGQ1NmMwYS0xYWVjLTRhZjEtYTMxMC02NmEyZDk0YWUzZDEifSwiZW1haWwiOiJzYW5nYW1wYXJtYXI5NEBnbWFpbC5jb20iLCJuYW1lIjoic2FuZ2FtIHBhcm1hciIsInJvbGxObyI6IjEyMjA2MzU0IiwiYWNjZXNzQ29kZSI6IkNaeXBRSyIsImNsaWVudElEIjoiOTBkNTZjMGEtMWFlYy00YWYxLWEzMTAtNjZhMmQ5NGFlM2QxIiwiY2xpZW50U2VjcmV0IjoiYkF1cmZWU0hyTk5BbnFUdiJ9.e-9YWRA6PVEi3M23Y6hEJwVEF40fgmwUYSfId8ZzEXI';
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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.bearerToken}`
                    },
                    body: JSON.stringify(logData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                // If logging fails, we don't want to crash the app
                // Silently fail to avoid console spam
                // console.error('Logging failed:', error.message);
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

export const logger = new FrontendLogger();
