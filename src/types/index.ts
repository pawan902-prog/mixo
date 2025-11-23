// Campaign Types
export interface Campaign {
    id: string;
    name: string;
    brand_id: string;
    status: 'active' | 'paused' | 'completed';
    budget: number;
    daily_budget: number;
    platforms: string[];
    created_at: string;
}

export interface CampaignsResponse {
    campaigns: Campaign[];
    total: number;
}

export interface CampaignDetailResponse {
    campaign: Campaign;
}

// Insights Types
export interface CampaignInsights {
    campaign_id?: string;
    timestamp: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    conversion_rate: number;
}

export interface OverallInsights {
    timestamp: string;
    total_campaigns: number;
    active_campaigns: number;
    paused_campaigns: number;
    completed_campaigns: number;
    total_impressions: number;
    total_clicks: number;
    total_conversions: number;
    total_spend: number;
    avg_ctr: number;
    avg_cpc: number;
    avg_conversion_rate: number;
}

export interface InsightsResponse {
    insights: CampaignInsights | OverallInsights;
}

// API Error Types
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

