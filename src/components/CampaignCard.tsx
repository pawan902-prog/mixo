// Campaign Card Component
// Displays a single campaign in a card format

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/types';
import { ArrowRight, Calendar, DollarSign } from 'lucide-react';

// Define what props this component expects
interface CampaignCardProps {
    campaign: Campaign; // The campaign data to display
}

// Main component function
const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
    // Helper function to get color based on campaign status
    const getStatusColor = (status: string): string => {
        if (status === 'active') {
            return 'bg-green-500';
        } else if (status === 'paused') {
            return 'bg-yellow-500';
        } else if (status === 'completed') {
            return 'bg-gray-500';
        }
        return 'bg-gray-500';
    };

    // Helper function to format date nicely
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Helper function to format money amounts
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Render the card
    return (
        <Link to={`/campaigns/${campaign.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {campaign.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(campaign.status)}>
                                {campaign.status}
                            </Badge>
                            <div className="flex gap-1 flex-wrap">
                                {campaign.platforms.map((platform) => (
                                    <Badge key={platform} variant="outline" className="text-xs">
                                        {platform}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4" />
                        <span>Budget: {formatCurrency(campaign.budget)}</span>
                        <span className="text-gray-400">•</span>
                        <span>Daily: {formatCurrency(campaign.daily_budget)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {formatDate(campaign.created_at)}</span>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default CampaignCard;
