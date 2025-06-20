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
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 truncate pr-2">
                        {creator.channel_name}
                    </h3>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInfluenceColor(creator.influence_score)}`}
                    >
                        <Zap className="h-3 w-3 mr-1" />
                        {Math.round(creator.influence_score)} Influence
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                    <Stat icon={Users} value={formatNumber(creator.subscriber_count)} label="subs" />
                    <Stat icon={Eye} value={formatNumber(creator.avg_view_count)} label="avg views" />
                    <Stat icon={Video} value={creator.upload_frequency.toFixed(1)} label="uploads/mo" />
                </div>

                <p className="text-sm text-gray-600 h-10 overflow-hidden leading-5">
                    {creator.channel_description || 'No description available.'}
                </p>
            </div>
            <div className="bg-gray-50 px-5 py-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Updated: {new Date(creator.last_updated).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default CreatorCard; 