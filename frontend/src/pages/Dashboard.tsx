import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CreatorCard from '../components/CreatorCard';
import api from '../config/api';

// This is a mock creator object for placeholder purposes
const mockCreator = {
  name: "MrBeast",
  subscriberCount: "250M",
  videoCount: "700",
  viewCount: "20B",
  thumbnailUrl: "https://yt3.ggpht.com/ytc/AAUvwni_LdnpDi-SOIhjp4Kxo2l_yVBo-1F1QZH_W0Q=s800-c-k-c0x00ffffff-no-rj"
}

const Dashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await api.get(`/search?q=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      // For now, we'll just clear the results on error
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find YouTube Creators</h1>
        <p className="text-gray-600 mb-4">Use the search bar below to get started.</p>
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
        />
        {loading && <p className="mt-4">Loading...</p>}
        <div className="mt-8 grid gap-4">
            {results.map((creator, index) => (
                <CreatorCard key={index} {...creator} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 