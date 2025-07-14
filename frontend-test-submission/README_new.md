# URL Shortener Frontend

This is the React frontend for our URL shortener application. It provides a clean, user-friendly interface for creating short URLs and viewing analytics.

## What it does

The frontend lets users:
- Submit multiple URLs at once for shortening
- Set custom expiration times and short codes
- View all their shortened URLs with click statistics
- Copy short URLs and open them directly
- See detailed analytics including click locations and timestamps

## Technology used

- **React 18** - Modern React with hooks
- **Material-UI** - Google's Material Design components
- **React Router** - For navigation between pages
- **axios** - For making API calls to the backend
- **validator** - For client-side URL validation

## Main components

### URL Shortener Page (`src/pages/UrlShortener.js`)
This is where users can create new short URLs. The form supports bulk processing - you can submit up to 5 URLs at once. Each URL can have its own custom shortcode and expiration time.

### Statistics Page (`src/pages/Statistics.js`)
Shows all the URLs you've created with detailed analytics. You can see how many times each link was clicked, where the clicks came from, and other useful data.

### Components
- `Navigation.js` - The top navigation bar
- `UrlForm.js` - The main form for creating URLs
- `StatisticsCard.js` - Individual cards that show URL analytics

## How to run it

Make sure you have Node.js installed, then:

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
```

3. **Start the development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## How it works with the backend

The frontend talks to the backend API to:
- Create new short URLs (`POST /shorturls`)
- Get analytics for existing URLs (`GET /shorturls/:shortcode`)
- Handle redirects when someone clicks a short link

All API calls include proper error handling, and the UI shows loading states while requests are processing.

## Data storage

The app uses browser session storage to remember your URLs between page refreshes. This means your data persists during your session but gets cleared when you close the browser.

## Design

I've tried to keep the design clean and intuitive:
- Material-UI components for consistent styling
- Responsive layout that works on mobile and desktop
- Clear feedback for user actions (success/error messages)
- Loading indicators for better user experience

## Error handling

The app handles various error scenarios:
- Invalid URLs (shows validation errors)
- Network issues (shows connection errors)
- Backend errors (displays user-friendly error messages)
- Empty states (helpful messages when no data is available)

## Features

- **Bulk URL processing** - Submit multiple URLs at once
- **Custom options** - Set your own shortcodes and expiration times
- **Real-time validation** - Immediate feedback on invalid URLs
- **Click analytics** - See detailed statistics for each URL
- **Copy to clipboard** - Easy sharing of shortened URLs
- **Responsive design** - Works well on all screen sizes

The frontend is designed to be straightforward and efficient, making URL shortening as easy as possible while providing useful analytics for power users.
