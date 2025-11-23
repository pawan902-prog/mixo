// Campaigns Redux Slice
// This file manages all campaign-related state in Redux

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCampaigns, getCampaignById } from '@/services/campaignService';
import { Campaign } from '@/types';

// Define the shape of our campaigns state
interface CampaignsState {
    campaigns: Campaign[]; // List of all campaigns
    total: number; // Total count of campaigns
    selectedCampaign: Campaign | null; // Currently selected campaign
    loading: boolean; // Is data loading?
    error: string | null; // Error message if something went wrong
}

// Starting state when app loads
const initialState: CampaignsState = {
    campaigns: [],
    total: 0,
    selectedCampaign: null,
    loading: false,
    error: null,
};

// Async function to fetch all campaigns from API
export const fetchCampaigns = createAsyncThunk(
    'campaigns/fetchCampaigns', // Action name
    async () => {
        const response = await getCampaigns();
        return response; // Return data to Redux
    }
);

// Async function to fetch one campaign by ID
export const fetchCampaignById = createAsyncThunk(
    'campaigns/fetchCampaignById',
    async (id: string) => {
        const response = await getCampaignById(id);
        return response.campaign; // Return just the campaign object
    }
);

// Create the slice (like a reducer with actions)
const campaignsSlice = createSlice({
    name: 'campaigns', // Name of this slice
    initialState, // Starting state
    reducers: {
        // Action to clear selected campaign
        clearSelectedCampaign: (state) => {
            state.selectedCampaign = null;
        },
        // Action to clear error message
        clearError: (state) => {
            state.error = null;
        },
    },
    // Handle async actions (fetchCampaigns, fetchCampaignById)
    extraReducers: (builder) => {
        // When fetching campaigns starts
        builder.addCase(fetchCampaigns.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        // When fetching campaigns succeeds
        builder.addCase(fetchCampaigns.fulfilled, (state, action) => {
            state.loading = false;
            state.campaigns = action.payload.campaigns;
            state.total = action.payload.total;
            state.error = null;
        });
        // When fetching campaigns fails
        builder.addCase(fetchCampaigns.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch campaigns';
        });

        // When fetching one campaign starts
        builder.addCase(fetchCampaignById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        // When fetching one campaign succeeds
        builder.addCase(fetchCampaignById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedCampaign = action.payload;
            state.error = null;
        });
        // When fetching one campaign fails
        builder.addCase(fetchCampaignById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch campaign';
        });
    },
});

// Export actions so we can use them in components
export const { clearSelectedCampaign, clearError } = campaignsSlice.actions;

// Export reducer to add to store
export default campaignsSlice.reducer;
