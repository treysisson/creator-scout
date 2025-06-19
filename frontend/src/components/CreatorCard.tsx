import React from 'react';
import { formatNumber } from '../utils/formatters';

interface Creator {
    channel_name: string;
    subscriber_count: number;
    avg_view_count: number;
    upload_frequency: number;
    influence_score: number;
    channel_description: string;
    last_updated: string;
}

interface CreatorCardProps {
    creator: Creator;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
    const scoreColor = () => {
        if (creator.influence_score >= 80) return 'text-green-600';
        if (creator.influence_score >= 60) return 'text-blue-600';
        if (creator.influence_score >= 40) return 'text-yellow-600';
        return 'text-gray-600';
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                        {creator.channel_name}
                    </h3>
                    <div className={`text-lg font-bold ${scoreColor()}`}>
                        {Math.round(creator.influence_score)}
                    </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {creator.channel_description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-sm font-medium text-gray-500">Subscribers</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {formatNumber(creator.subscriber_count)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-medium text-gray-500">Avg. Views</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {formatNumber(creator.avg_view_count)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-medium text-gray-500">Monthly Uploads</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {creator.upload_frequency.toFixed(1)}
                        </div>
                    </div>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                    Last updated: {new Date(creator.last_updated).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default CreatorCard; 