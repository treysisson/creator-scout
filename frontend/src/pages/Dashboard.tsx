import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CreatorCard from '../components/CreatorCard';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { api } from '../config/api';

interface Creator {
    channel_name: string;
    subscriber_count: number;
    avg_view_count: number;
    upload_frequency: number;
    influence_score: number;
    channel_description: string;
    last_updated: string;
}

const Dashboard: React.FC = () => {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (query: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${api.baseURL}${api.endpoints.search}`, {
                params: { query }
            });
            setCreators(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to search creators');
            setCreators([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(`${api.baseURL}${api.endpoints.export}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'creators.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Failed to export creators');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    CreatorScout
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover and analyze YouTube creators based on their performance metrics and influence score.
                </p>
            </div>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {creators.length > 0 && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Search Results ({creators.length})
                        </h2>
                        <button
                            onClick={handleExport}
                            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                            Export to CSV
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {creators.map((creator) => (
                            <CreatorCard key={creator.channel_name} creator={creator} />
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && creators.length === 0 && !error && (
                <div className="mt-8 text-center text-gray-600">
                    Search for YouTube creators to see their metrics and influence scores.
                </div>
            )}
        </div>
    );
};

export default Dashboard; 