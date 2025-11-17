import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { formatDate } from '../utils/dateFormatter';

const MiningSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [walletFilter, setWalletFilter] = useState('');

  useEffect(() => {
    fetchSessions();
  }, [currentPage, statusFilter, walletFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMiningSessions(currentPage, 10, statusFilter, walletFilter);
      setSessions(data.sessions);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch mining sessions');
      console.error('Sessions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatWallet = (wallet) => {
    return `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      mining: 'status-badge status-mining',
      claimed: 'status-badge status-claimed',
      cancelled: 'status-badge status-cancelled'
    };
    return <span className={statusClasses[status]}>{status}</span>;
  };

  if (loading && sessions.length === 0) {
    return <div className="loading">Loading sessions...</div>;
  }

  return (
    <div>
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Mining Sessions ({pagination.totalSessions || 0})</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
              style={{ width: '150px' }}
            >
              <option value="">All Status</option>
              <option value="mining">Mining</option>
              <option value="claimed">Claimed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="text"
              placeholder="Filter by wallet..."
              value={walletFilter}
              onChange={(e) => {
                setWalletFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
              style={{ width: '200px' }}
            />
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Duration</th>
                <th>Multi</th>
                <th>Status</th>
                <th>Earned</th>
                <th style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>Started</th>
              </tr>
            </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={session._id} style={{ animationDelay: `${index * 0.05}s` }}>
                <td>
                  <code style={{ 
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)', 
                    padding: '8px 12px', 
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}>
                    {formatWallet(session.wallet)}
                  </code>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>⏱️</span>
                    <span style={{ fontWeight: '600', color: '#D1D5DB' }}>
                      {session.selectedHour}h
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    borderRadius: '20px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    <span style={{ fontSize: '16px' }}>⚡</span>
                    <span style={{ color: '#8B5CF6', fontWeight: '700', fontSize: '14px' }}>
                      {session.multiplier}x
                    </span>
                  </div>
                </td>
                <td>{getStatusBadge(session.status)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>💰</span>
                    <span style={{ 
                      color: '#FBBF24', 
                      fontWeight: '700',
                      fontSize: '14px',
                      textShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
                    }}>
                      {session.totalEarned.toFixed(4)}
                    </span>
                  </div>
                </td>
                <td style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>
                  <span style={{ 
                    color: '#9CA3AF',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {formatDate(session.miningStartTime)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

        {sessions.length === 0 && !loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
            No mining sessions found.
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="pagination-btn"
            >
              ← Previous
            </button>
            
            <span className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningSessions;
