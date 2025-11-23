# Project Structure Documentation

## Overview
This is a TypeScript-based React application for managing advertising campaigns with real-time insights streaming.

## Folder Structure

```
src/
├── api/                    # API Configuration
│   └── axios.ts           # Axios instance with request/response interceptors
│                          # - Base URL configuration
│                          # - Request interceptor (adds auth tokens)
│                          # - Response interceptor (error handling with toast)
│
├── components/            # React Components
│   ├── CampaignCard.tsx   # Card component for displaying campaign in list
│   ├── InsightsCard.tsx   # Card component for displaying insights metrics
│   ├── StreamingInsights.tsx  # Component for real-time SSE insights
│   └── ui/                # shadcn/ui components (Button, Card, Badge, etc.)
│
├── errors/                # Error Handling
│   ├── ErrorHandler.tsx   # React Error Boundary component
│   └── ErrorPage.tsx      # 404/Error page component
│
├── pages/                 # Page Components
│   ├── DashboardPage.tsx  # Main dashboard with overall insights
│   ├── CampaignsPage.tsx # List of all campaigns with filters
│   └── CampaignDetailPage.tsx  # Individual campaign details + insights
│
├── services/              # API Service Functions
│   └── campaignService.ts # All API calls for campaigns and insights
│                          # - getCampaigns()
│                          # - getCampaignById()
│                          # - getOverallInsights()
│                          # - getCampaignInsights()
│                          # - streamCampaignInsights() (SSE)
│
├── types/                 # TypeScript Type Definitions
│   └── index.ts          # All interfaces and types
│                          # - Campaign
│                          # - CampaignInsights
│                          # - OverallInsights
│                          # - ApiError
│
└── utils/                 # Utility Functions
    ├── errorUtils.ts     # Error handling utilities
    └── utils.ts          # General utilities (cn function)
```

## Key Features

### 1. Axios Interceptors (`src/api/axios.ts`)
- **Request Interceptor**: Adds authentication tokens if available
- **Response Interceptor**: Handles all API errors and shows toast notifications
- Centralized error handling for:
  - 400 (Bad Request)
  - 401 (Unauthorized)
  - 403 (Forbidden)
  - 404 (Not Found)
  - 500 (Server Error)
  - 503 (Service Unavailable)
  - Network errors
  - Timeout errors

### 2. Error Handling (`src/errors/`)
- **ErrorHandler.tsx**: React Error Boundary that catches component errors
- **ErrorPage.tsx**: Handles route errors (404, etc.)
- **errorUtils.ts**: Helper functions for error message extraction

### 3. API Services (`src/services/campaignService.ts`)
All API calls are centralized here:
- Standard GET requests using axios
- SSE streaming for real-time insights
- Proper TypeScript typing

### 4. TypeScript Types (`src/types/index.ts`)
All API response types are defined here for type safety.

## API Endpoints Used

Base URL: `https://mixo-fe-backend-task.vercel.app`

1. `GET /campaigns` - List all campaigns
2. `GET /campaigns/:id` - Get campaign details
3. `GET /campaigns/insights` - Get overall insights
4. `GET /campaigns/:id/insights` - Get campaign insights
5. `GET /campaigns/:id/insights/stream` - Stream real-time insights (SSE)

## Routing

- `/` - Dashboard (overall insights)
- `/campaigns` - Campaigns list
- `/campaigns/:id` - Campaign detail page
- `*` - Error page (404)

## Error Handling Flow

1. **API Errors**: Caught by axios interceptor → Toast notification shown
2. **Component Errors**: Caught by ErrorHandler boundary → Error UI shown
3. **Route Errors**: Caught by React Router → ErrorPage shown

## Toast Notifications

Using `react-toastify`:
- Position: Top-right
- Auto-close: 5 seconds
- Theme: Dark
- Shows for all API errors automatically

## Best Practices Implemented

✅ TypeScript for type safety
✅ Centralized API configuration
✅ Error boundaries for React errors
✅ Toast notifications for user feedback
✅ Clean folder structure
✅ Reusable components
✅ Proper error handling at all levels
✅ Real-time data streaming with SSE
✅ Responsive design with Tailwind CSS

