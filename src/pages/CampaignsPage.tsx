// Campaigns Page Component
// Shows a list of all campaigns with search and filter options

import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCampaigns } from '@/store/slices/campaignsSlice';
import CampaignCard from '@/components/CampaignCard';
import { Campaign } from '@/types';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CampaignsPage: React.FC = () => {
    // Get Redux hooks
    const dispatch = useAppDispatch(); // To send actions to Redux
    const { campaigns, total, loading, error } = useAppSelector((state) => state.campaigns); // Get data from Redux

    // Local state for filters
    const [searchTerm, setSearchTerm] = useState<string>(''); // What user typed in search box
    const [statusFilter, setStatusFilter] = useState<string>('all'); // Filter by status (all/active/paused/completed)
    const [platformFilter, setPlatformFilter] = useState<string>('all'); // Filter by platform

    // Fetch campaigns when page loads
    useEffect(() => {
        dispatch(fetchCampaigns());
    }, [dispatch]);

    // Filter campaigns based on search and filters
    const filteredCampaigns = useMemo(() => {
        if (!campaigns || campaigns.length === 0) {
            return [];
        }

        return campaigns.filter((campaign: Campaign) => {
            // Check if campaign matches search term
            const matchesSearch =
                campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaign.id.toLowerCase().includes(searchTerm.toLowerCase());

            // Check if campaign matches status filter
            const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

            // Check if campaign matches platform filter
            const matchesPlatform =
                platformFilter === 'all' || campaign.platforms.includes(platformFilter);

            // Return true if all filters match
            return matchesSearch && matchesStatus && matchesPlatform;
        });
    }, [campaigns, searchTerm, statusFilter, platformFilter]);

    // Get list of unique platforms for filter dropdown
    const uniquePlatforms = useMemo(() => {
        const allPlatforms: string[] = [];
        campaigns.forEach((campaign) => {
            campaign.platforms.forEach((platform) => {
                if (!allPlatforms.includes(platform)) {
                    allPlatforms.push(platform);
                }
            });
        });
        return allPlatforms;
    }, [campaigns]);

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    // Show error message if something went wrong
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => dispatch(fetchCampaigns())}>Try Again</Button>
                </div>
            </div>
        );
    }

    // Main page content
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Campaigns
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage and monitor your advertising campaigns
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                    </select>
                    {/* Platform Filter */}
                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Platforms</option>
                        {uniquePlatforms.map((platform) => (
                            <option key={platform} value={platform}>
                                {platform}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campaigns List */}
                {filteredCampaigns.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            No campaigns found matching your filters.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCampaigns.map((campaign: Campaign) => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {total > 0 && (
                    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {filteredCampaigns.length} of {total} campaigns
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignsPage;
