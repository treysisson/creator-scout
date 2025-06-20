import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find YouTube Creators</h1>
        <p className="text-gray-600 mb-4">Use the search bar below to get started.</p>
        <SearchBar />
      </div>
    </div>
  );
};

export default Dashboard; 