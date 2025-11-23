# Redux Toolkit Setup Documentation

## Overview
This project uses **Redux Toolkit** (RTK) for state management, providing a modern and efficient way to manage application state.

## Installation
```bash
npm install @reduxjs/toolkit react-redux --legacy-peer-deps
```

## Project Structure

```
src/
├── store/
│   ├── index.ts              # Store configuration
│   ├── hooks.ts              # Typed Redux hooks
│   └── slices/
│       ├── campaignsSlice.ts # Campaigns state management
│       └── insightsSlice.ts  # Insights state management
```

## Store Configuration

The Redux store is configured in `src/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import campaignsReducer from './slices/campaignsSlice';
import insightsReducer from './slices/insightsSlice';

export const store = configureStore({
  reducer: {
    campaigns: campaignsReducer,
    insights: insightsReducer,
  },
});
```

## Typed Hooks

Custom typed hooks are available in `src/store/hooks.ts`:

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Use in components
const dispatch = useAppDispatch();
const campaigns = useAppSelector((state) => state.campaigns);
```

## Slices

### 1. Campaigns Slice (`campaignsSlice.ts`)

**State:**
- `campaigns`: Array of all campaigns
- `total`: Total number of campaigns
- `selectedCampaign`: Currently selected campaign
- `loading`: Loading state
- `error`: Error message

**Actions:**
- `fetchCampaigns()` - Fetch all campaigns
- `fetchCampaignById(id)` - Fetch campaign by ID
- `clearSelectedCampaign()` - Clear selected campaign
- `clearError()` - Clear error state

**Usage:**
```typescript
const dispatch = useAppDispatch();
const { campaigns, loading, error } = useAppSelector((state) => state.campaigns);

useEffect(() => {
  dispatch(fetchCampaigns());
}, [dispatch]);
```

### 2. Insights Slice (`insightsSlice.ts`)

**State:**
- `overallInsights`: Overall insights data
- `campaignInsights`: Object mapping campaignId to insights
- `streamingInsights`: Object mapping campaignId to streaming insights
- `loading`: Loading state
- `error`: Error message

**Actions:**
- `fetchOverallInsights()` - Fetch overall insights
- `fetchCampaignInsights(campaignId)` - Fetch campaign insights
- `updateStreamingInsights({ campaignId, insights })` - Update streaming insights
- `clearStreamingInsights(campaignId)` - Clear streaming insights
- `clearError()` - Clear error state

**Usage:**
```typescript
const dispatch = useAppDispatch();
const { overallInsights, campaignInsights } = useAppSelector((state) => state.insights);

useEffect(() => {
  dispatch(fetchOverallInsights());
}, [dispatch]);

// Update streaming data
dispatch(updateStreamingInsights({ campaignId: 'camp_001', insights: data }));
```

## Provider Setup

The Redux Provider is set up in `src/App.tsx`:

```typescript
import { Provider } from 'react-redux';
import { store } from '@/store';

<Provider store={store}>
  {/* Your app components */}
</Provider>
```

## Benefits of Redux Toolkit

1. **Less Boilerplate**: RTK reduces the amount of code needed
2. **TypeScript Support**: Full type safety out of the box
3. **DevTools Integration**: Built-in Redux DevTools support
4. **Async Thunks**: Built-in support for async operations
5. **Immer Integration**: Automatic immutable updates
6. **Centralized State**: Single source of truth for application state

## Best Practices

1. **Use Typed Hooks**: Always use `useAppDispatch` and `useAppSelector`
2. **Async Thunks**: Use `createAsyncThunk` for API calls
3. **Selectors**: Create reusable selectors for complex state access
4. **Normalization**: Store data in normalized form when possible
5. **Error Handling**: Handle errors in thunks and update state accordingly

## Example Component Usage

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCampaigns } from '@/store/slices/campaignsSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { campaigns, loading, error } = useAppSelector((state) => state.campaigns);

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return <div>{/* Render campaigns */}</div>;
};
```

## Redux DevTools

The store is configured with Redux DevTools support. Install the browser extension to:
- Inspect state changes
- Time-travel debugging
- Action replay
- State export/import

