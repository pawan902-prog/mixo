import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCampaignById } from '@/store/slices/campaignsSlice';
import { fetchCampaignInsights } from '@/store/slices/insightsSlice';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, DollarSign, Loader2 } from 'lucide-react';
import InsightsCard from '@/components/InsightsCard';
import StreamingInsights from '@/components/StreamingInsights';

const CampaignDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { selectedCampaign, loading } = useAppSelector((state) => state.campaigns);
    const { campaignInsights, loading: insightsLoading } = useAppSelector(
        (state) => state.insights
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchCampaignById(id));
            dispatch(fetchCampaignInsights(id));
        }
    }, [id, dispatch]);

    const insights = id ? campaignInsights[id] : null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'paused':
                return 'bg-yellow-500';
            case 'completed':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!selectedCampaign) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Campaign not found</p>
                    <Button asChild>
                        <Link to="/campaigns">Go Back</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Button asChild variant="ghost" className="mb-4">
                        <Link to="/campaigns">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Campaigns
                        </Link>
                    </Button>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {selectedCampaign.name}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={getStatusColor(selectedCampaign.status)}>
                                    {selectedCampaign.status}
                                </Badge>
                                {selectedCampaign.platforms.map((platform) => (
                                    <Badge key={platform} variant="outline">
                                        {platform}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaign Details */}
                <Card className="p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Campaign Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Campaign ID</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                {selectedCampaign.id}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Brand ID</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                {selectedCampaign.brand_id}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Total Budget
                            </p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                {formatCurrency(selectedCampaign.budget)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Daily Budget
                            </p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                {formatCurrency(selectedCampaign.daily_budget)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Created At
                            </p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                {formatDate(selectedCampaign.created_at)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Static Insights */}
                {insightsLoading ? (
                    <Card className="p-6 mb-6">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500 mx-auto" />
                    </Card>
                ) : insights ? (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Campaign Insights
                        </h2>
                        <InsightsCard insights={insights} />
                    </div>
                ) : null}

                {/* Streaming Insights */}
                {id && <StreamingInsights campaignId={id} />}
            </div>
        </div>
    );
};

export default CampaignDetailPage;
