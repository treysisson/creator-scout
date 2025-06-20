import React from 'react';
import { Users, Eye, Video, Zap } from 'lucide-react';

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

const Stat = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
    <div className="flex items-center text-sm text-gray-500">
        <Icon className="h-4 w-4 mr-1.5 text-gray-400" />
        <span className="font-semibold text-gray-700">{value}</span>
        <span className="ml-1">{label}</span>
    </div>
);

const CreatorCard = ({ creator }: CreatorCardProps) => {
    const getInfluenceColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-700 ring-green-600/20';
        if (score >= 60) return 'bg-yellow-100 text-yellow-700 ring-yellow-600/20';
        return 'bg-red-100 text-red-700 ring-red-600/20';
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 pr-2">
                        {creator.channel_name}
                    </h3>
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${getInfluenceColor(creator.influence_score)}`}
                    >
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        {Math.round(creator.influence_score)}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                    <Stat icon={Users} value={formatNumber(creator.subscriber_count)} label="Subscribers" />
                    <Stat icon={Eye} value={formatNumber(creator.avg_view_count)} label="Avg. Views" />
                    <Stat icon={Video} value={creator.upload_frequency.toFixed(1)} label="Uploads/mo" />
                </div>

                <p className="text-sm text-gray-600 h-10 overflow-hidden leading-5">
                    {creator.channel_description || 'No description available.'}
                </p>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    Updated: {new Date(creator.last_updated).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default CreatorCard; 