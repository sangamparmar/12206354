# URL Shortener Backend

This is the backend service for our URL shortener application. It's built with Node.js and Express, using MongoDB for data storage.

## How it works

The backend provides a simple REST API that lets you create short URLs and track their usage. When someone clicks a shortened link, we redirect them to the original URL and log some basic analytics.

## What's included

The codebase is organized into several key parts:
- `server.js` - The main Express application
- `models/Url.js` - MongoDB schema for storing URLs
- `controllers/urlController.js` - The business logic for handling requests
- `routes/urlRoutes.js` - API route definitions
- `config/database.js` - Database connection setup

## Features

- Create short URLs with optional custom codes
- Set expiration times for URLs (default is 30 minutes)
- Track clicks with basic geolocation
- Automatic cleanup of expired URLs
- Input validation to prevent malicious URLs
- Proper error handling and logging
- CORS support for frontend integration

## API Endpoints

### Create a short URL
`POST /shorturls`

Send a JSON request with the URL you want to shorten:
```json
{
  "url": "https://example.com/very/long/url",
  "validity": 30,
  "shortcode": "my-custom-code"
}
```

The `validity` field sets how long the URL will work (in minutes), and `shortcode` lets you choose a custom short code instead of a random one.

**Response:**
```json
{
  "shortLink": "http://localhost:5000/my-custom-code",
  "expiry": "2025-07-14T12:30:00.000Z"
}
```
### Get URL details
`GET /shorturls/:shortcode`

This endpoint returns information about a shortened URL, including click analytics.

**Response:**
```json
{
  "shortcode": "my-custom-code",
  "originalUrl": "https://example.com/very/long/url",
  "createdAt": "2025-07-14T12:00:00.000Z",
  "expiry": "2025-07-14T12:30:00.000Z",
  "clicks": [
    {
      "timestamp": "2025-07-14T12:15:00.000Z",
      "referrer": "https://google.com",
      "location": "US"
    }
  ]
}
```

### Redirect to original URL
`GET /:shortcode`

When someone visits the short URL, they get redirected to the original URL. We also track this visit for analytics.

### Health check
`GET /health`

Simple endpoint to check if the service is running properly.

## Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm/yarn

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**
Create `.env` file:
```env
PORT=5000
You'll need Node.js and MongoDB installed on your machine.

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
Create a `.env` file in the root directory:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urlshortener
LOG_LEVEL=info
```

3. **Start MongoDB**
Make sure MongoDB is running on your machine, or update the connection string to point to your MongoDB Atlas cluster.

4. **Run the application**
```bash
# For development (with auto-restart)
npm run dev

# For production
npm start
```

## Project Structure

The code is organized to keep things clean and maintainable:

- **Models** (`models/Url.js`) - Defines the database schema for URLs and click tracking
- **Controllers** (`controllers/urlController.js`) - Contains the main business logic for creating URLs, handling redirects, and fetching analytics
- **Routes** (`routes/urlRoutes.js`) - Defines the API endpoints
- **Utils** (`utils/logger.js`) - Custom logging functionality

## 🔍 Analytics & Tracking

### Click Tracking Features
- **Timestamp** - Exact time of click
- **Referrer** - Source website/application
- **Location** - Country-level geolocation using `geoip-lite`
- **IP Anonymization** - IP addresses are not stored

### Data Retention
- Expired URLs are automatically cleaned up every 5 minutes
- Click data is preserved until URL expires
- Database indexes optimize query performance

## 🛡️ Security & Validation

### Input Validation
- URL format validation using `validator` library
- Shortcode format validation (alphanumeric, hyphens, underscores)
- Validity period validation (positive integers only)
- Request size limits and timeouts

### Security Headers
- CORS configuration for frontend integration
- Trust proxy settings for accurate IP detection
- Rate limiting protection (planned enhancement)

## 🚀 Performance Optimizations

### Database
- **Indexes** on `shortcode` and `expiry` fields
- **Connection pooling** with Mongoose
- **Automatic cleanup** of expired documents
- **Efficient queries** with proper field selection

### Application
- **Error handling** without crashes
- **Memory management** with cleanup intervals
- **Logging optimization** with queue-based system
- **Response streaming** for large datasets

## 📊 Monitoring & Logging

### Custom Logging System
All logs are sent to the evaluation service endpoint:
```javascript
POST http://20.244.56.144/evaluation-service/logs
{
  "stack": "backend",
  "level": "info|warn|error|debug|fatal",
  "package": "handler|route|controller|middleware",
  "message": "Log message"
}
```

### Log Categories
- **handler** - Server-level events
- **route** - API endpoint access
- **controller** - Business logic events
- **middleware** - Request/response logging

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create short URL with valid long URL
- [ ] Create short URL with custom shortcode
- [ ] Create short URL with custom validity
- [ ] Test duplicate shortcode rejection
- [ ] Test invalid URL rejection
- [ ] Test URL redirection
- [ ] Test expired URL handling
- [ ] Test analytics retrieval
- [ ] Test click tracking
- [ ] Test health check endpoint

### Postman Testing
Use the provided Postman collection to test all endpoints with various scenarios:
- Valid and invalid inputs
- Edge cases and error conditions
- Performance testing with concurrent requests

## 🔄 Database Schema

### URL Collection
```javascript
{
  _id: ObjectId,
  shortcode: "abc123",
  originalUrl: "https://example.com/long/url",
  createdAt: ISODate("2025-07-14T12:00:00Z"),
  expiry: ISODate("2025-07-14T12:30:00Z"),
  clicks: [
    {
      timestamp: ISODate("2025-07-14T12:15:00Z"),
      referrer: "https://google.com",
      location: "US"
    }
  ],
  __v: 0
}
```

### Indexes
```javascript
{ shortcode: 1 }     // Unique index for fast lookups
{ expiry: 1 }        // TTL index for automatic cleanup
```

## � **API Testing Screenshots**

All Postman API testing screenshots are available in the `screenshots/` folder:

### **Available Screenshots:**
- `01_health_check.png` - GET /health endpoint
- `02_create_basic_url.png` - POST /shorturls (basic URL creation)
- `03_create_custom_validity.png` - POST /shorturls (with custom validity)
- `04_create_custom_shortcode.png` - POST /shorturls (with custom shortcode)
- `05_create_full_options.png` - POST /shorturls (all parameters)
- `06_get_analytics.png` - GET /shorturls/:shortcode (URL analytics)
- `07_redirect_test.png` - GET /:shortcode (redirect functionality)
- `08_error_invalid_url.png` - Error handling for invalid URL
- `09_error_duplicate_shortcode.png` - Error handling for duplicate shortcode
- `10_error_non_existent.png` - Error handling for non-existent shortcode

Each screenshot shows:
- ✅ Request details (method, URL, body)
- ✅ Response body with status code
- ✅ Response time for performance evaluation
