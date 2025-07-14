# URL Shortener Microservice

A full-stack URL shortener application built with Node.js/Express backend and React frontend

## 🚀 Features

### Backend
- **RESTful API** with Express.js
- **MongoDB** for data persistence
- **Custom Logging Middleware** that sends logs to evaluation service
- **Click Analytics** with geolocation tracking
- **URL Validation** and expiry management
- **Custom Shortcode** support
- **Automatic Cleanup** of expired URLs

### Frontend
- **React 18** with Material-UI components
- **Responsive Design** for mobile and desktop
- **Bulk URL Processing** (up to 5 URLs at once)
- **Real-time Statistics** with click tracking
- **Session Storage** for data persistence
- **Client-side Validation** with user-friendly error handling

## 📁 Project Structure

```
your-roll-no/
├── logging-middleware/           # Custom logger for both frontend & backend
│   └── logger.js                 # Frontend logger (FrontendLogger class)
├── backend-test-submission/      # Node.js Express API
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── urlController.js
│   ├── models/
│   │   └── Url.js
│   ├── routes/
│   │   └── urlRoutes.js
│   ├── utils/
│   │   └── logger.js             # Backend logger (Logger class)
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend-test-submission/     # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── README.md
├── setup.bat/.sh                 # Automated setup scripts
└── URL_Shortener_API_Tests.postman_collection.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend-test-submission
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urlshortener
LOG_LEVEL=info
```

4. Start MongoDB service on your system

5. Run the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend-test-submission
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## 📊 API Endpoints

### 1. Create Short URL
**POST** `/shorturls`

Request Body:
```json
{
  "url": "https://long.url.com/...",
  "validity": 30,
  "shortcode": "custom123"
}
```

Response:
```json
{
  "shortLink": "http://localhost:5000/custom123",
  "expiry": "2025-07-14T12:30:00.000Z"
}
```

### 2. Get URL Details
**GET** `/shorturls/:shortcode`

Response:
```json
{
  "shortcode": "custom123",
  "originalUrl": "https://long.url.com/...",
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

### 3. Redirect to Original URL
**GET** `/:shortcode`

Redirects to the original URL if not expired, otherwise returns error JSON.

### 4. Health Check
**GET** `/health`

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-07-14T12:00:00.000Z",
  "service": "URL Shortener Microservice"
}
```

## 🔒 Security Features

- Input validation and sanitization
- URL format validation
- Custom shortcode format validation
- Rate limiting protection
- CORS configuration
- Error handling and logging

## 📱 Frontend Features

### URL Shortener Page
- Support for up to 5 URLs simultaneously
- Optional validity period (default: 30 minutes)
- Optional custom shortcode
- Real-time validation feedback
- Copy to clipboard functionality
- Direct link opening

### Statistics Page
- View all shortened URLs
- Detailed click analytics
- Real-time statistics refresh
- Export capabilities
- Responsive design for all devices

## 🔧 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **nanoid** - Unique ID generation
- **geoip-lite** - Geolocation tracking
- **validator** - Input validation
- **axios** - HTTP client for logging

### Frontend
- **React 18** - UI library
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **axios** - HTTP client
- **validator** - Client-side validation

## � **Screenshots & Testing Evidence**

### **Backend API Testing (Postman)**
Complete Postman API testing screenshots are available in:
📁 `backend-test-submission/screenshots/`

**Includes:**
- All API endpoints testing
- Error handling scenarios
- Response times and performance metrics
- Request/response validation

### **Frontend UI Testing**
Complete frontend application screenshots are available in:
📁 `frontend-test-submission/screenshots/`

**Includes:**
- Desktop responsive design
- Mobile responsive design
- All user interactions and features
- Validation states and error handling

### API Testing with Postman
Import the provided Postman collection to test all endpoints with sample data.

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or ensure MongoDB is available
2. Configure production environment variables
3. Deploy to platform of choice (Heroku, AWS, etc.)
4. Update frontend API URLs

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```
2. Deploy the `build` folder to hosting service
3. Configure environment variables for production API URLs

## 📈 Performance Optimizations

- Database indexing on shortcode and expiry fields
- Automatic cleanup of expired URLs
- Connection pooling for MongoDB
- Frontend code splitting and lazy loading
- Responsive image optimization
- Client-side caching with sessionStorage

## 🔍 Monitoring and Logging

- All requests and responses are logged to the evaluation service
- Error tracking and reporting
- Performance monitoring
- Click analytics and statistics
