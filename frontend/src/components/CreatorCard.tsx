import React from 'react';

interface CreatorCardProps {
  name: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  thumbnailUrl: string;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  name,
  subscriberCount,
  videoCount,
  viewCount,
  thumbnailUrl,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
      <img src={thumbnailUrl} alt={name} className="w-24 h-24 rounded-full" />
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">Subscribers: {subscriberCount}</p>
        <p className="text-gray-600">Videos: {videoCount}</p>
        <p className="text-gray-600">Views: {viewCount}</p>
      </div>
    </div>
  );
};

export default CreatorCard; 