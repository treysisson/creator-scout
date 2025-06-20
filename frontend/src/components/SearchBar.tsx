import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  return (
    <div className="mt-4 flex">
      <input
        type="text"
        placeholder="Enter a YouTube channel name..."
        className="w-full p-2 border border-gray-300 rounded-l-md"
        value={value}
        onChange={onChange}
      />
      <button
        onClick={onSearch}
        className="bg-blue-500 text-white p-2 rounded-r-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar; 