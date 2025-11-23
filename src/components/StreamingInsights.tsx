import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { streamCampaignInsights } from '@/services/campaignService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateStreamingInsights, clearStreamingInsights } from '@/store/slices/insightsSlice';
import { Play, Pause, RefreshCw } from 'lucide-react';
import InsightsCard from './InsightsCard';

interface StreamingInsightsProps {
    campaignId: string;
}

const StreamingInsights: React.FC<StreamingInsightsProps> = ({ campaignId }) => {
    const dispatch = useAppDispatch();
    const streamingInsights = useAppSelector(
        (state) => state.insights.streamingInsights[campaignId]
    );
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    const stopStreaming = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsStreaming(false);
        dispatch(clearStreamingInsights(campaignId));
    }, [campaignId, dispatch]);

    const startStreaming = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        setError(null);
        setIsStreaming(true);

        eventSourceRef.current = streamCampaignInsights(
            campaignId,
            (data) => {
                dispatch(updateStreamingInsights({ campaignId, insights: data }));
            },
            (err) => {
                setError(err.message);
                setIsStreaming(false);
            }
        );
    }, [campaignId, dispatch]);

    useEffect(() => {
        // Auto-start streaming on mount
        startStreaming();

        // Cleanup on unmount
        return () => {
            stopStreaming();
        };
    }, [campaignId, startStreaming, stopStreaming]);

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Real-time Insights
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Live streaming data for campaign performance
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isStreaming ? (
                            <Button onClick={stopStreaming} variant="outline" size="sm">
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                            </Button>
                        ) : (
                            <Button onClick={startStreaming} variant="default" size="sm">
                                <Play className="h-4 w-4 mr-2" />
                                Start
                            </Button>
                        )}
                        <Button onClick={startStreaming} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {isStreaming && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-4">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Streaming live data...</span>
                    </div>
                )}

                {streamingInsights && <InsightsCard insights={streamingInsights} />}
            </Card>
        </div>
    );
};

export default StreamingInsights;
