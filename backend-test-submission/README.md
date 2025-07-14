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

## What makes this secure

The application includes several security measures:
- URL validation to prevent malicious links
- Input sanitization for shortcodes
- Proper error handling without exposing system details
- CORS configuration for safe frontend integration

## Performance considerations

I've included some optimizations to keep things running smoothly:
- Database indexes on frequently queried fields
- Automatic cleanup of expired URLs
- Efficient MongoDB queries
- Connection pooling for database access

## Logging

The application includes custom logging that integrates with the evaluation service. All important events (URL creation, redirects, errors) are logged for monitoring and debugging.

## Testing

You can test the API using the included Postman collection or any HTTP client. Here are the main things to test:
- Creating URLs with different options
- Following short links to see redirects
- Checking analytics for created URLs
- Error handling for invalid inputs

The application is ready to run and should handle typical URL shortening use cases reliably.
