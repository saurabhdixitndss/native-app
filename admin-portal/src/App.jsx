import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import MiningSessions from './components/MiningSessions';
import Analytics from './components/Analytics';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

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
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="main-content">
        <Header currentPage={currentPage} />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
