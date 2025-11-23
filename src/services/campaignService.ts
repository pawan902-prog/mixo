// Campaign Service
// Functions to call the API and get campaign data

import axiosInstance from '@/api/axios';
import {
    CampaignsResponse,
    CampaignDetailResponse,
    InsightsResponse,
    CampaignInsights,
} from '@/types';

/**
 * Get all campaigns from the API
 * Returns: List of campaigns and total count
 */
export const getCampaigns = async (): Promise<CampaignsResponse> => {
    const response = await axiosInstance.get<CampaignsResponse>('/campaigns');
    return response.data;
};

/**
 * Get one campaign by its ID
 * Parameters: id - the campaign ID (like "camp_001")
 * Returns: Campaign details
 */
export const getCampaignById = async (id: string): Promise<CampaignDetailResponse> => {
    const response = await axiosInstance.get<CampaignDetailResponse>(`/campaigns/${id}`);
    return response.data;
};

/**
 * Get overall insights for all campaigns
 * Returns: Overall statistics and metrics
 */
export const getOverallInsights = async (): Promise<InsightsResponse> => {
    const response = await axiosInstance.get<InsightsResponse>('/campaigns/insights');
    return response.data;
};

/**
 * Get insights for one specific campaign
 * Parameters: id - the campaign ID
 * Returns: Campaign-specific insights
 */
export const getCampaignInsights = async (id: string): Promise<InsightsResponse> => {
    const response = await axiosInstance.get<InsightsResponse>(`/campaigns/${id}/insights`);
    return response.data;
};

/**
 * Stream real-time insights for a campaign
 * This uses Server-Sent Events (SSE) to get live updates
 * Parameters:
 *   - campaignId: The campaign ID to stream
 *   - onData: Function to call when new data arrives
 *   - onError: Optional function to call if there's an error
 * Returns: EventSource object (can be closed later)
 */
export const streamCampaignInsights = (
    campaignId: string,
    onData: (data: CampaignInsights) => void,
    onError?: (error: Error) => void
): EventSource => {
    // Create connection to streaming endpoint
    const url = `https://mixo-fe-backend-task.vercel.app/campaigns/${campaignId}/insights/stream`;
    const eventSource = new EventSource(url);

    // When new data arrives from server
    eventSource.onmessage = (event) => {
        try {
            // Parse the JSON data
            const data: CampaignInsights = JSON.parse(event.data);
            // Call the callback function with the new data
            onData(data);
        } catch (error) {
            // If parsing fails, call error handler
            const err = error instanceof Error ? error : new Error('Failed to parse stream data');
            if (onError) {
                onError(err);
            }
        }
    };

    // If connection fails
    eventSource.onerror = () => {
        const err = new Error('EventSource failed');
        if (onError) {
            onError(err);
        }
        eventSource.close(); // Close the connection
    };

    return eventSource; // Return so we can close it later
};
