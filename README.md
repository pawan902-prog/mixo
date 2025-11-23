# Campaign Management Dashboard

A modern, TypeScript-based React application for managing and monitoring advertising campaigns with real-time insights streaming.

## Features

- ✅ **TypeScript** - Type-safe codebase
- ✅ **Axios Interceptors** - Centralized API error handling
- ✅ **Toast Notifications** - User-friendly error and success messages
- ✅ **Error Handling** - Comprehensive error boundaries and error pages
- ✅ **Real-time Streaming** - Live campaign insights via Server-Sent Events
- ✅ **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ✅ **Best Practices** - Clean folder structure and code organization

## Project Structure

```
src/
├── api/              # API configuration
│   └── axios.ts      # Axios instance with interceptors
├── components/       # Reusable UI components
│   ├── CampaignCard.tsx
│   ├── InsightsCard.tsx
│   ├── StreamingInsights.tsx
│   └── ui/           # UI primitives (shadcn/ui)
├── errors/           # Error handling
│   ├── ErrorHandler.tsx  # Error boundary component
│   └── ErrorPage.tsx     # 404/error page component
├── pages/            # Page components
│   ├── DashboardPage.tsx
│   ├── CampaignsPage.tsx
│   └── CampaignDetailPage.tsx
├── services/         # API service functions
│   └── campaignService.ts
├── types/            # TypeScript type definitions
│   └── index.ts
└── utils/            # Utility functions
    └── errorUtils.ts
```

## API Endpoints

- `GET /campaigns` - List all campaigns
- `GET /campaigns/:id` - Get campaign details
- `GET /campaigns/insights` - Get overall insights
- `GET /campaigns/:id/insights` - Get campaign-specific insights
- `GET /campaigns/:id/insights/stream` - Stream real-time insights (SSE)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Error Handling

The application includes comprehensive error handling:

- **Axios Interceptors**: Automatically handle API errors and show toast notifications
- **Error Boundary**: Catches React component errors
- **Error Page**: Handles 404 and route errors
- **Error Utils**: Helper functions for error message extraction

## Technologies Used

- React 19
- TypeScript
- Vite
- Axios
- React Router
- React Toastify
- Tailwind CSS
- Radix UI (shadcn/ui components)

## Base URL

All API calls use: `https://mixo-fe-backend-task.vercel.app`
