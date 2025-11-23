// Insights Redux Slice
// This file manages all insights-related state in Redux

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOverallInsights, getCampaignInsights } from '@/services/campaignService';
import { CampaignInsights, OverallInsights } from '@/types';

// Define the shape of our insights state
interface InsightsState {
    overallInsights: OverallInsights | null; // Overall insights for all campaigns
    campaignInsights: { [key: string]: CampaignInsights }; // Insights for each campaign (key = campaignId)
    streamingInsights: { [key: string]: CampaignInsights }; // Real-time streaming insights
    loading: boolean; // Is data loading?
    error: string | null; // Error message if something went wrong
}

// Starting state when app loads
const initialState: InsightsState = {
    overallInsights: null,
    campaignInsights: {},
    streamingInsights: {},
    loading: false,
    error: null,
};

// Async function to fetch overall insights from API
export const fetchOverallInsights = createAsyncThunk(
    'insights/fetchOverallInsights',
    async () => {
        const response = await getOverallInsights();
        return response.insights as OverallInsights;
    }
);

// Async function to fetch insights for one campaign
export const fetchCampaignInsights = createAsyncThunk(
    'insights/fetchCampaignInsights',
    async (campaignId: string) => {
        const response = await getCampaignInsights(campaignId);
        return {
            campaignId: campaignId,
            insights: response.insights as CampaignInsights,
        };
    }
);

// Create the slice (like a reducer with actions)
const insightsSlice = createSlice({
    name: 'insights',
    initialState,
    reducers: {
        // Action to update streaming insights (real-time data)
        updateStreamingInsights: (state, action) => {
            const campaignId = action.payload.campaignId;
            const insights = action.payload.insights;
            state.streamingInsights[campaignId] = insights;
        },
        // Action to clear streaming insights for a campaign
        clearStreamingInsights: (state, action) => {
            const campaignId = action.payload;
            delete state.streamingInsights[campaignId];
        },
        // Action to clear error message
        clearError: (state) => {
            state.error = null;
        },
    },
    // Handle async actions
    extraReducers: (builder) => {
        // When fetching overall insights starts
        builder.addCase(fetchOverallInsights.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        // When fetching overall insights succeeds
        builder.addCase(fetchOverallInsights.fulfilled, (state, action) => {
            state.loading = false;
            state.overallInsights = action.payload;
            state.error = null;
        });
        // When fetching overall insights fails
        builder.addCase(fetchOverallInsights.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch overall insights';
        });

        // When fetching campaign insights starts
        builder.addCase(fetchCampaignInsights.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        // When fetching campaign insights succeeds
        builder.addCase(fetchCampaignInsights.fulfilled, (state, action) => {
            state.loading = false;
            const campaignId = action.payload.campaignId;
            const insights = action.payload.insights;
            state.campaignInsights[campaignId] = insights;
            state.error = null;
        });
        // When fetching campaign insights fails
        builder.addCase(fetchCampaignInsights.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch campaign insights';
        });
    },
});

// Export actions so we can use them in components
export const { updateStreamingInsights, clearStreamingInsights, clearError } =
    insightsSlice.actions;

// Export reducer to add to store
export default insightsSlice.reducer;
