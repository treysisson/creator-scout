import React from 'react';
import {
  UserCircleIcon,
  VideoCameraIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface Creator {
    channel_id: string;
    channel_name: string;
    subscriber_count: number;
    avg_view_count: number;
    upload_frequency: number;
    influence_score: number;
    channel_description: string;
    platform: string;
    last_updated: string;
}

interface CreatorCardProps {
    creator: Creator;
}

const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num.toString();
};

const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Icon className="h-5 w-5 text-gray-400" />
        <span><strong>{value}</strong> {label}</span>
    </div>
);

const CreatorCard = ({ creator }: CreatorCardProps) => {
    const getInfluenceColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-blue-100 text-blue-800';
        if (score >= 40) return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 truncate pr-4">
                        {creator.channel_name}
                    </h3>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${getInfluenceColor(creator.influence_score)}`}>
                        <SparklesIcon className="h-4 w-4" />
                        <span>{Math.round(creator.influence_score)}</span>
                    </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 h-10 overflow-hidden">
                    {creator.channel_description}
                </p>

                <div className="space-y-4">
                    <StatItem icon={UserCircleIcon} label="Subscribers" value={formatNumber(creator.subscriber_count)} />
                    <StatItem icon={ChartBarIcon} label="Avg Views" value={formatNumber(creator.avg_view_count)} />
                    <StatItem icon={VideoCameraIcon} label="Uploads/Month" value={creator.upload_frequency.toFixed(1)} />
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
                <p className="text-xs text-gray-500">
                    Last updated: {new Date(creator.last_updated).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default CreatorCard; 