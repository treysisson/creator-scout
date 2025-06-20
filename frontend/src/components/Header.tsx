import { Link } from 'react-router-dom';

const Header = () => (
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600">
                        CreatorScout
                    </Link>
                </div>
                <nav className="flex items-center space-x-6">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    >
                        Dashboard
                    </Link>
                    <a
                        href="#"
                        className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    >
                        About
                    </a>
                    <a
                        href="#"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Contact
                    </a>
                </nav>
            </div>
        </div>
    </header>
);

export default Header; 