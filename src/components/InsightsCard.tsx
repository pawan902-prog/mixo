import React from 'react';
import { Card } from '@/components/ui/card';
import { CampaignInsights, OverallInsights } from '@/types';
import {
    TrendingUp,
    MousePointerClick,
    Target,
    DollarSign,
    Eye,
    Users,
} from 'lucide-react';

interface InsightsCardProps {
    insights: CampaignInsights | OverallInsights;
    isOverall?: boolean;
}



const InsightsCard: React.FC<InsightsCardProps> = ({ insights, isOverall = false }) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(2)}%`;
    };


    if (isOverall) {
        const overallInsights = insights as OverallInsights;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Campaigns
                        </h3>
                        <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(overallInsights.total_campaigns)}
                    </p>
                    <div className="mt-4 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span>Active: {overallInsights.active_campaigns}</span>
                        <span>Paused: {overallInsights.paused_campaigns}</span>
                        <span>Done: {overallInsights.completed_campaigns}</span>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Impressions
                        </h3>
                        <Eye className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(overallInsights.total_impressions)}
                    </p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Clicks
                        </h3>
                        <MousePointerClick className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(overallInsights.total_clicks)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Avg CTR: {formatPercentage(overallInsights.avg_ctr)}
                    </p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Spend
                        </h3>
                        <DollarSign className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(overallInsights.total_spend)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Avg CPC: {formatCurrency(overallInsights.avg_cpc)}
                    </p>
                </Card>

                <Card className="p-6 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Conversions
                        </h3>
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(overallInsights.total_conversions)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Avg Conversion Rate: {formatPercentage(overallInsights.avg_conversion_rate)}
                    </p>
                </Card>
            </div>
        );
    }

    const campaignInsights = insights as CampaignInsights;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Impressions
                    </h3>
                    <Eye className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(campaignInsights.impressions)}
                </p>
            </Card>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Clicks
                    </h3>
                    <MousePointerClick className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(campaignInsights.clicks)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    CTR: {formatPercentage(campaignInsights.ctr)}
                </p>
            </Card>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Conversions
                    </h3>
                    <Target className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(campaignInsights.conversions)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Rate: {formatPercentage(campaignInsights.conversion_rate)}
                </p>
            </Card>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Spend
                    </h3>
                    <DollarSign className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(campaignInsights.spend)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    CPC: {formatCurrency(campaignInsights.cpc)}
                </p>
            </Card>
        </div>
    );
};

export default InsightsCard;

