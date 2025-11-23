import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCampaigns } from '@/store/slices/campaignsSlice';
import { fetchOverallInsights } from '@/store/slices/insightsSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import InsightsCard from '@/components/InsightsCard';

const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { overallInsights, loading } = useAppSelector((state) => state.insights);
    const { campaigns } = useAppSelector((state) => state.campaigns);

    useEffect(() => {
        dispatch(fetchOverallInsights());
        dispatch(fetchCampaigns());
    }, [dispatch]);

    const recentCampaigns = useMemo(() => {
        return campaigns.slice(0, 5);
    }, [campaigns]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Overview of all campaign performance metrics
                    </p>
                </div>

                {/* Overall Insights */}
                {overallInsights && (
                    <div className="mb-8">
                        <InsightsCard insights={overallInsights} isOverall={true} />
                    </div>
                )}

                {/* Recent Campaigns */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Recent Campaigns
                        </h2>
                        <Button asChild variant="outline">
                            <Link to="/campaigns">
                                View All
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {recentCampaigns.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                                No campaigns available
                            </p>
                        ) : (
                            recentCampaigns.map((campaign) => (
                                <Link
                                    key={campaign.id}
                                    to={`/campaigns/${campaign.id}`}
                                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {campaign.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {campaign.platforms.join(', ')}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
