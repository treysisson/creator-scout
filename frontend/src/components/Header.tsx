import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary-600">
                            CreatorScout
                        </Link>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                            YouTube
                        </span>
                    </div>
                    <nav className="flex space-x-4">
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Dashboard
                        </Link>
                        <a
                            href="https://developers.google.com/youtube/v3/getting-started"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            API Docs
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header; 