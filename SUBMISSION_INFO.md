# Affordmed Campus Hiring Submission - Sangam Parmar

## 🎓 Student Information
- **Name**: Sangam Parmar
- **Email**: sangamparmar94@gmail.com
- **Roll Number**: 12206354
- **Access Code**: CZypQK
- **Client ID**: 90d56c0a-1aec-4af1-a310-66a2d94ae3d1
- **GitHub Username**: sangamparmar

## 🚀 Assignment: URL Shortener Microservice

### ✅ **Completed Requirements**

#### **Backend Features**
- [x] RESTful API with Express.js
- [x] MongoDB data persistence
- [x] Custom logging middleware with Bearer authentication
- [x] 3 Required API endpoints:
  - `POST /shorturls` - Create short URLs
  - `GET /shorturls/:shortcode` - Get analytics
  - `GET /:shortcode` - Redirect to original URL
- [x] Click analytics with geolocation tracking
- [x] URL validation and expiry management (default 30 minutes)
- [x] Custom shortcode support with global uniqueness
- [x] Automatic cleanup of expired URLs
- [x] Health check endpoint (`GET /health`)

#### **Frontend Features**
- [x] React 18 with Material-UI components only
- [x] Responsive design for mobile and desktop
- [x] Bulk URL processing (up to 5 URLs at once)
- [x] Real-time statistics with click tracking
- [x] Session storage for data persistence
- [x] Client-side validation with user-friendly error handling
- [x] Two main pages: URL Shortener and Statistics

#### **Technical Requirements**
- [x] Custom logging middleware sends logs to evaluation service
- [x] No use of console.log() - all logging through custom middleware
- [x] Material-UI styling throughout application
- [x] MongoDB storage for URLs and analytics
- [x] 30-minute default validity (configurable)
- [x] Global unique shortcodes with collision detection
- [x] Production-grade code quality

### 🏗️ **Application Architecture**

#### **Folder Structure**
```
your-roll-no/
├── logging-middleware/           # Custom logger classes
├── backend-test-submission/      # Node.js Express API
│   ├── utils/logger.js          # Backend logger with Bearer auth
│   ├── config/database.js       # MongoDB connection
│   ├── controllers/             # Business logic
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   └── server.js               # Main server file
├── frontend-test-submission/     # React Application
│   ├── src/services/logger.js   # Frontend logger with Bearer auth
│   ├── src/components/          # Reusable UI components
│   ├── src/pages/              # Main pages
│   ├── src/hooks/              # Custom React hooks
│   └── src/services/           # API services
├── README.md                    # Main documentation
└── URL_Shortener_API_Tests.postman_collection.json
```

### 🌐 **Deployment URLs**
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Health Check**: http://localhost:5000/health

### 🔐 **Authentication Details**
- **Bearer Token**: Configured in both frontend and backend loggers
- **Token Expiry**: January 14, 2026 (1752472623)
- **Logging Endpoint**: http://20.244.56.144/evaluation-service/logs

### 📊 **API Testing**
- Complete Postman collection provided for all endpoints
- Error handling for all edge cases
- Performance metrics and response time validation
- CORS handling for cross-origin requests

### 📱 **Frontend Testing**
- Mobile responsiveness verified
- Desktop layout optimized
- Bulk URL processing tested (1-5 URLs)
- Statistics page with real-time analytics
- Session storage persistence working

### 🛡️ **Security Features**
- Input validation and sanitization
- URL format validation
- Custom shortcode format validation
- CORS configuration
- Error handling without system crashes

### 📈 **Performance Optimizations**
- Database indexing on shortcode and expiry fields
- Automatic cleanup of expired URLs every 5 minutes
- Connection pooling for MongoDB
- Frontend code splitting and optimization
- Client-side caching with sessionStorage

## 🎯 **Submission Status: READY FOR GITHUB**

✅ All requirements implemented and tested
✅ Bearer token authentication configured
✅ Complete documentation provided
✅ Postman collection ready for API testing
✅ Screenshots organized in respective folders
✅ Production-grade code quality maintained
✅ Comments removed from code
✅ Unnecessary files removed
✅ .gitignore files added
✅ Project cleaned for GitHub submission

### 📁 **Final Project Structure**
```
your-roll-no/
├── backend-test-submission/
│   ├── screenshots/             # Backend API screenshots
│   ├── config/database.js
│   ├── controllers/urlController.js
│   ├── models/Url.js
│   ├── routes/urlRoutes.js
│   ├── utils/logger.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   └── README.md
├── frontend-test-submission/
│   ├── screenshots/             # Frontend UI screenshots
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .gitignore
│   └── README.md
├── logging-middleware/
│   └── logger.js               # Original logger reference
├── README.md
├── SUBMISSION_INFO.md
├── URL_Shortener_API_Tests.postman_collection.json
└── .gitignore
```

### 🚀 **Ready for GitHub Push**
1. Initialize git repository
2. Add all files to git
3. Commit with proper message
4. Push to GitHub
5. Submit GitHub repository link

---

**Project completed and cleaned for Affordmed Campus Hiring Evaluation**
**Date**: July 14, 2025
