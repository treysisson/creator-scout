import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* You can add more routes here for other pages */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
