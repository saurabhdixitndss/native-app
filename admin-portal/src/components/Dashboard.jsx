import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={fetchDashboardStats} style={{ marginLeft: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card" style={{ borderTop: '3px solid #8B5CF6' }}>
          <div className="stat-header">
            <div className="stat-title">Total Users</div>
            <div className="stat-icon">👥</div>
          </div>
          <div className="stat-value">{formatNumber(stats?.totalUsers || 0)}</div>
          <div className="stat-change">Registered users</div>
        </div>

        <div className="stat-card" style={{ borderTop: '3px solid #10B981' }}>
          <div className="stat-header">
            <div className="stat-title">Active Sessions</div>
            <div className="stat-icon">⛏️</div>
          </div>
          <div className="stat-value">{formatNumber(stats?.activeSessions || 0)}</div>
          <div className="stat-change">Currently mining</div>
        </div>

        <div className="stat-card" style={{ borderTop: '3px solid #3B82F6' }}>
          <div className="stat-header">
            <div className="stat-title">Total Sessions</div>
            <div className="stat-icon">📊</div>
          </div>
          <div className="stat-value">{formatNumber(stats?.totalSessions || 0)}</div>
          <div className="stat-change">All time sessions</div>
        </div>

        <div className="stat-card" style={{ borderTop: '3px solid #F59E0B' }}>
          <div className="stat-header">
            <div className="stat-title">Tokens Mined</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">{(stats?.totalTokensMined || 0).toFixed(2)}</div>
          <div className="stat-change">Total earned</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">📋 System Overview</h2>
          <button onClick={fetchDashboardStats} className="pagination-btn">
            🔄 Refresh Data
          </button>
        </div>
        
        <div style={{ padding: '32px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{ 
                color: '#8B5CF6', 
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📈 Growth Rate
              </h4>
              <p style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: '1.6' }}>
                Users are actively joining the platform with steady growth
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{ 
                color: '#10B981', 
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⚡ Mining Activity
              </h4>
              <p style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: '1.6' }}>
                High engagement with mining features and active sessions
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{ 
                color: '#F59E0B', 
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                💎 Token Economy
              </h4>
              <p style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: '1.6' }}>
                Healthy token distribution and reward system
              </p>
            </div>
          </div>
          
          {stats?.config && (
            <div style={{
              padding: '24px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginBottom: '24px'
            }}>
              <h4 style={{ 
                color: '#3B82F6', 
                marginBottom: '16px',
                fontSize: '16px',
                fontWeight: '700'
              }}>
                ⚙️ Configuration
              </h4>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>Base Rate</p>
                  <p style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '700' }}>
                    {stats.config.baseRate}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>Duration Options</p>
                  <p style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '700' }}>
                    {stats.config.durationsCount}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>Multipliers</p>
                  <p style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '700' }}>
                    {stats.config.multipliersCount}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {stats?.timestamp && (
            <div style={{ 
              padding: '16px 20px', 
              background: 'rgba(139, 92, 246, 0.08)', 
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <p style={{ 
                color: '#9CA3AF', 
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>📅</span>
                Last updated: {new Date(stats.timestamp).toLocaleString()}
              </p>
              <div style={{
                padding: '6px 12px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '20px',
                color: '#10B981',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  background: '#10B981', 
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite'
                }}></span>
                LIVE
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
