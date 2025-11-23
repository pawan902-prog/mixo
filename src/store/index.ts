// Redux Store Configuration
// This file sets up our Redux store where all app state lives

import { configureStore } from '@reduxjs/toolkit';
import campaignsReducer from './slices/campaignsSlice';
import insightsReducer from './slices/insightsSlice';

// Create the Redux store
export const store = configureStore({
    reducer: {
        campaigns: campaignsReducer, // Handle campaign state
        insights: insightsReducer, // Handle insights state
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore EventSource in Redux (for streaming)
                ignoredActions: ['insights/streamUpdate'],
            },
        }),
});

// TypeScript types for the store
// RootState = the type of our entire Redux state
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch = the type of dispatch function
export type AppDispatch = typeof store.dispatch;
