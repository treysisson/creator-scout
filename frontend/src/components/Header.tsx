import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <Search className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">CreatorScout</span>
            </Link>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Dashboard
              </Link>
            </nav>
            <div className="ml-4 flex items-center md:ml-6">
                {/* User profile section - can be expanded later */}
                <div className="ml-3 relative">
                    <div>
                        <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="h-8 w-8 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                            />
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 