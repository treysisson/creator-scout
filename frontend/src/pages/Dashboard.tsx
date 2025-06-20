import { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CreatorCard from '../components/CreatorCard';
// Ensure VITE_API_URL is set in your .env.local file
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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
const Dashboard = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const response = await axios.get(`${API_URL}/api/search/youtube`, {
        params: { q: query },
      });
      setCreators(response.data);
    } catch (err) {
      setError('Failed to fetch creators. Please try again.');
      setCreators([]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Find Your Next <span className="text-indigo-600">Star Creator</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Unlock insights into YouTube creators. Search by channel name to get started.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>
      {error && (
        <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}
      <div className="mt-12">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-500">Searching for creators...</p>
          </div>
        ) : hasSearched && creators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((creator) => (
              <CreatorCard key={creator.channel_id} creator={creator} />
            ))}
          </div>
        ) : hasSearched && !error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800">No Creators Found</h3>
            <p className="mt-2 text-gray-500">
              We couldn't find any creators matching your search. Try a different name.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default Dashboard; 