import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import MiningSessions from './components/MiningSessions';
import Analytics from './components/Analytics';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when page changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'sessions':
        return <MiningSessions />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Header currentPage={currentPage} />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>
    </div>
  );
}

export default App;
