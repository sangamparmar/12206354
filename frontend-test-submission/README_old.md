# Frontend - URL Shortener React Application

A modern, responsive React application with Material-UI for the URL Shortener service, featuring bulk URL processing and comprehensive analytics.

## 🎨 User Interface Features

### URL Shortener Page
- **Bulk Processing** - Submit up to 5 URLs simultaneously
- **Custom Options** - Set validity periods and custom shortcodes
- **Real-time Validation** - Client-side input validation with immediate feedback
- **Results Display** - Success/error status with copy and open actions
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### Statistics Page
- **URL Management** - View all shortened URLs with detailed analytics
- **Click Tracking** - Real-time click statistics with location data
- **Expandable Cards** - Accordion-style interface for detailed information
- **Data Actions** - Copy URLs, open links, refresh data, clear storage

## 🏗️ Architecture

### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── Navigation.js    # App navigation header
│   ├── UrlForm.js       # Bulk URL input form
│   └── StatisticsCard.js # Analytics display component
├── pages/               # Main page components
│   ├── UrlShortener.js  # URL creation page
│   └── Statistics.js    # Analytics dashboard
├── hooks/               # Custom React hooks
│   └── useLocalStorage.js # Session storage management
├── services/            # API and utility services
│   ├── api.js          # Backend API communication
│   └── logger.js       # Frontend logging service
├── App.js              # Main application component
└── index.js            # Application entry point
```

### Technology Stack
- **React 18** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Comprehensive component library
- **React Router** - Client-side routing
- **axios** - HTTP client for API communication
- **validator** - Client-side input validation

## 🚀 Setup & Installation

### Prerequisites
- Node.js v16+
- npm or yarn
- Backend service running on port 5000

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm start
```

3. **Build for Production**
```bash
npm run build
```

The application will be available at `http://localhost:3000`

## 📱 User Experience

### URL Shortener Interface

#### Input Form Features
- **Dynamic Fields** - Add/remove URL input fields (1-5 URLs)
- **Validation Feedback** - Real-time error messages and suggestions
- **Smart Defaults** - 30-minute validity period default
- **Batch Processing** - Process multiple URLs with single submission

#### Form Validation
- **URL Format** - Validates proper URL format
- **Validity Period** - Ensures positive integer values
- **Shortcode Format** - Alphanumeric characters, hyphens, underscores only
- **Required Fields** - Clear indication of mandatory inputs

#### Results Display
```javascript
// Success Result
{
  shortLink: "http://localhost:5000/abc123",
  expiry: "2025-07-14T12:30:00.000Z",
  originalUrl: "https://example.com",
  success: true
}

// Error Result
{
  originalUrl: "invalid-url",
  success: false,
  error: "Please enter a valid URL"
}
```

### Statistics Dashboard

#### URL Cards
Each shortened URL is displayed in an expandable card showing:
- **Basic Info** - Short URL, original URL, status
- **Quick Actions** - Copy, open, refresh buttons
- **Status Indicators** - Active/expired chips, click count

#### Detailed Analytics
When expanded, cards show:
- **Metadata** - Creation time, expiry time
- **Click Statistics** - Total clicks, click history table
- **Geographic Data** - Country-level location tracking
- **Referrer Information** - Traffic source tracking

## 🔧 Component Documentation

### UrlForm Component
```javascript
// Props
{
  onSubmit: (urlData) => Promise,  // URL submission handler
  loading: boolean                 // Loading state indicator
}

// Features
- Multi-URL input management
- Client-side validation
- Error state handling
- Result display with actions
```

### StatisticsCard Component
```javascript
// Props
{
  urls: Array,                    // Array of shortened URLs
  onRefresh: () => void,          // Refresh handler
  onClear: () => void            // Clear all data handler
}

// Features
- Expandable URL details
- Real-time analytics fetching
- Click history table
- Responsive design
```

### Navigation Component
```javascript
// Features
- Responsive navigation header
- Active route highlighting
- Mobile-optimized layout
- Brand identity display
```

## 🗃️ Data Management

### Session Storage
URLs are stored in browser session storage for persistence:
```javascript
// Storage Structure
{
  shortenedUrls: [
    {
      id: timestamp,
      shortLink: "http://localhost:5000/abc123",
      originalUrl: "https://example.com",
      expiry: "2025-07-14T12:30:00.000Z",
      shortcode: "abc123"
    }
  ]
}
```

### Custom Hooks
#### useLocalStorage Hook
```javascript
const [urls, setUrls] = useLocalStorage('shortenedUrls', []);

// Methods
- addUrl(urlData)      // Add new URL to storage
- updateUrl(shortcode, updates)  // Update existing URL
- clearUrls()          // Clear all stored URLs
```

## 🌐 API Integration

### API Service (`services/api.js`)
Centralized API communication with interceptors:

```javascript
// Methods
- createShortUrl(urlData)    // POST /shorturls
- getUrlDetails(shortcode)   // GET /shorturls/:shortcode
- healthCheck()              // GET /health

// Features
- Request/response logging
- Error handling
- Timeout configuration
- Axios interceptors
```

### Request/Response Flow
```javascript
// Create Short URL
Request: {
  url: "https://example.com",
  validity: 30,
  shortcode: "custom123"
}

Response: {
  shortLink: "http://localhost:5000/custom123",
  expiry: "2025-07-14T12:30:00.000Z"
}
```

## 📊 Logging System

### Frontend Logging Service
All frontend events are logged to the evaluation service:

```javascript
// Log Categories
- component: UI component interactions
- api: API calls and responses
- hook: Custom hook operations

// Log Levels
- debug: Development information
- info: General information
- warn: Warning conditions
- error: Error conditions
- fatal: Critical errors
```

### Usage Examples
```javascript
import { logger } from '../services/logger';

// Component interactions
logger.info('component', 'User clicked submit button');

// API calls
logger.info('api', 'Creating short URL for: https://example.com');

// Errors
logger.error('component', 'Form validation failed: Invalid URL');
```

## 🎨 UI/UX Design

### Material-UI Theme
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' }
      }
    }
  }
});
```

### Responsive Breakpoints
- **Mobile** - `xs` (0-600px)
- **Tablet** - `sm` (600-960px)
- **Desktop** - `md+` (960px+)

### Component Styling
- **Cards** - Elevated design with shadows
- **Buttons** - Consistent styling with hover effects
- **Forms** - Clear labels and validation feedback
- **Tables** - Responsive with horizontal scrolling
- **Icons** - Material Design icons throughout

## 🔍 User Interactions

### URL Shortener Flow
1. User enters URL(s) in form fields
2. Optional: Set custom validity period
3. Optional: Set custom shortcode
4. Click "Shorten URLs" button
5. View results with copy/open actions
6. URLs automatically saved to statistics

### Statistics Flow
1. Navigate to Statistics page
2. View list of all shortened URLs
3. Click card to expand details
4. View click analytics and history
5. Use action buttons (copy, open, refresh)
6. Clear all data if needed

## 📱 Mobile Optimization

### Responsive Features
- **Navigation** - Collapsible menu for mobile
- **Forms** - Touch-friendly input fields
- **Cards** - Stacked layout on small screens
- **Tables** - Horizontal scrolling for data
- **Buttons** - Appropriate sizing for touch
- **Typography** - Readable font sizes

### Touch Interactions
- Large tap targets (44px minimum)
- Swipe gestures for card interactions
- Pull-to-refresh capability
- Haptic feedback where supported

## 🧪 Testing Guidelines

### Manual Testing Checklist

#### URL Shortener Page
- [ ] Add/remove URL input fields
- [ ] Submit valid URLs
- [ ] Test validation errors
- [ ] Copy short URLs to clipboard
- [ ] Open short URLs in new tab
- [ ] Test with custom shortcodes
- [ ] Test with custom validity periods
- [ ] Test mobile responsiveness

#### Statistics Page
- [ ] View URL list
- [ ] Expand/collapse URL details
- [ ] Refresh URL statistics
- [ ] Copy URLs from statistics
- [ ] Clear all statistics
- [ ] Test mobile layout

### Error Scenarios
- Network disconnection
- Backend service unavailable
- Invalid API responses
- Form validation failures
- Browser storage limitations

## 🚀 Performance Optimizations

### Code Splitting
- React lazy loading for routes
- Component-level code splitting
- Dynamic imports for large libraries

### Caching Strategy
- Session storage for URL data
- API response caching
- Asset caching with service workers

### Bundle Optimization
- Tree shaking for unused code
- Production build optimization
- Gzip compression for assets

## 📈 Analytics Tracking

### User Actions Logged
- URL form submissions
- Navigation between pages
- Button clicks and interactions
- API call success/failure rates
- Error occurrences and types

### Performance Metrics
- Page load times
- API response times
- User engagement metrics
- Error rates and patterns

## � **UI Screenshots**

All frontend application screenshots are available in the `screenshots/` folder:

### **Desktop Views:**
- `01_desktop_url_shortener.png` - URL Shortener page (desktop)
- `02_desktop_multiple_urls.png` - Bulk URL processing (desktop)
- `03_desktop_validation_errors.png` - Form validation errors (desktop)
- `04_desktop_success_results.png` - Successful URL creation (desktop)
- `05_desktop_statistics.png` - Statistics page (desktop)
- `06_desktop_statistics_expanded.png` - Expanded URL analytics (desktop)

### **Mobile Views:**
- `07_mobile_url_shortener.png` - URL Shortener page (mobile)
- `08_mobile_multiple_urls.png` - Bulk URL processing (mobile)
- `09_mobile_statistics.png` - Statistics page (mobile)
- `10_mobile_statistics_expanded.png` - Expanded URL analytics (mobile)

### **Features Demonstrated:**
- ✅ Responsive Material-UI design
- ✅ Bulk URL processing (up to 5 URLs)
- ✅ Real-time validation feedback
- ✅ Success/error state handling
- ✅ Click analytics and statistics
- ✅ Mobile-optimized layout
- ✅ Session storage persistence

---

**Modern, accessible, and performant React application ready for production deployment!**
