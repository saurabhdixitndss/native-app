import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers(currentPage, 10, searchTerm);
      setUsers(data.users);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWallet = (wallet) => {
    return `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div>
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">All Users ({pagination.totalUsers || 0})</h2>
          <input
            type="text"
            placeholder="Search by wallet address..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Wallet Address</th>
              <th>Total Tokens</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} style={{ animationDelay: `${index * 0.05}s` }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code 
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)', 
                        padding: '8px 12px', 
                        borderRadius: '8px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => copyToClipboard(user.walletAddress)}
                      title="Click to copy full address"
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {formatWallet(user.walletAddress)}
                    </code>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>💰</span>
                    <span style={{ 
                      color: '#FBBF24', 
                      fontWeight: '700',
                      fontSize: '15px',
                      textShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
                    }}>
                      {user.totalTokens.toFixed(4)}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ 
                    color: '#9CA3AF',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {formatDate(user.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
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

export default Users;
