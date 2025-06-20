import { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CreatorCard from '../components/CreatorCard';
import Header from '../components/Header';
import { BarChart3, Sparkles, AlertTriangle } from 'lucide-react';
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
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500">Searching for creators...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-20 bg-red-50 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium text-red-800">Search Error</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      );
    }
    if (hasSearched && creators.length === 0) {
      return (
        <div className="text-center py-20">
          <Sparkles className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Creators Found</h3>
          <p className="mt-1 text-sm text-gray-500">We couldn't find any creators matching your search. Try another name.</p>
        </div>
      );
    }
    if (creators.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.channel_id} creator={creator} />
          ))}
        </div>
      );
    }
    return (
      <div className="text-center py-20">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Find YouTube Creators</h3>
        <p className="mt-1 text-sm text-gray-500">Use the search bar above to get started.</p>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Search for YouTube influencers to analyze their stats.</p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard; 