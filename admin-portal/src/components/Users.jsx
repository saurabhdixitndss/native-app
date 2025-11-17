import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import PaymentModal from './PaymentModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const handlePayment = (user) => {
    setSelectedUser(user);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async (amount) => {
    try {
      await apiService.processPayment(selectedUser.walletAddress, amount);
      // Refresh users list
      await fetchUsers();
    } catch (err) {
      throw new Error(err.message || 'Payment failed');
    }
  };

  const getPaymentStatusBadge = (user) => {
    const status = user.paymentStatus || 'pending';
    const statusConfig = {
      pending: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', icon: '⏳', label: 'Pending' },
      processing: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', icon: '⚡', label: 'Processing' },
      completed: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', icon: '✓', label: 'Completed' },
      failed: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '✗', label: 'Failed' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: config.bg,
        borderRadius: '20px',
        border: `1px solid ${config.color}40`
      }}>
        <span style={{ fontSize: '14px' }}>{config.icon}</span>
        <span style={{
          color: config.color,
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {config.label}
        </span>
      </div>
    );
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div>
      <div className="table-container" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
      }}>
        <div className="table-header" style={{
          background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)'
        }}>
          <h2 className="table-title">
            <span style={{ marginRight: '8px' }}>👥</span>
            All Users ({pagination.totalUsers || 0})
          </h2>
          <input
            type="text"
            placeholder="🔍 Search by wallet address..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Tokens</th>
                <th>Paid</th>
                <th>Status</th>
                <th style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>Last Payment</th>
                <th style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>Joined</th>
                <th>Action</th>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>💵</span>
                    <span style={{ 
                      color: '#10B981', 
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {(user.totalPaid || 0).toFixed(4)}
                    </span>
                  </div>
                </td>
                <td>
                  {getPaymentStatusBadge(user)}
                </td>
                <td style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>
                  <span style={{ 
                    color: '#9CA3AF',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {user.lastPaymentDate ? formatDate(user.lastPaymentDate) : 'Never'}
                  </span>
                </td>
                <td style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>
                  <span style={{ 
                    color: '#9CA3AF',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {formatDate(user.createdAt)}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handlePayment(user)}
                    disabled={user.totalTokens <= 0}
                    style={{
                      padding: window.innerWidth < 768 ? '6px 10px' : '8px 16px',
                      background: user.totalTokens > 0 
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                        : 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: window.innerWidth < 768 ? '10px' : '12px',
                      fontWeight: '700',
                      cursor: user.totalTokens > 0 ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      boxShadow: user.totalTokens > 0 ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none',
                      opacity: user.totalTokens > 0 ? 1 : 0.5,
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      if (user.totalTokens > 0 && window.innerWidth >= 768) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = user.totalTokens > 0 ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none';
                    }}
                  >
                    {window.innerWidth < 768 ? '💰' : '💰 Pay'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

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

      {/* Payment Modal */}
      {showPaymentModal && selectedUser && (
        <PaymentModal
          user={selectedUser}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default Users;
