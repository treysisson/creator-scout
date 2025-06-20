import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Enter a YouTube channel name..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default SearchBar; 