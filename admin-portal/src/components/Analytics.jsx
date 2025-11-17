import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnalytics(days);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={fetchAnalytics} style={{ marginLeft: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="table-container" style={{ marginBottom: '20px' }}>
        <div className="table-header">
          <h2 className="table-title">Analytics Period</h2>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="search-input"
            style={{ width: '150px' }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderTop: '3px solid #3B82F6' }}>
          <div className="stat-header">
            <div className="stat-title">Status Distribution</div>
            <div className="stat-icon">📊</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            {analytics?.statusDistribution?.map((item, index) => {
              const colors = {
                mining: '#10B981',
                claimed: '#3B82F6',
                cancelled: '#EF4444'
              };
              const total = analytics.statusDistribution.reduce((sum, i) => sum + i.count, 0);
              const percentage = ((item.count / total) * 100).toFixed(1);
              
              return (
                <div key={item._id} style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '6px',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      color: '#D1D5DB', 
                      textTransform: 'capitalize',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {item._id}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        color: colors[item._id] || '#8B5CF6', 
                        fontWeight: '700',
                        fontSize: '16px'
                      }}>
                        {item.count}
                      </span>
                      <span style={{ 
                        color: '#9CA3AF',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${colors[item._id] || '#8B5CF6'} 0%, ${colors[item._id] || '#8B5CF6'}80 100%)`,
                      borderRadius: '4px',
                      transition: 'width 1s ease',
                      boxShadow: `0 0 10px ${colors[item._id] || '#8B5CF6'}40`
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: '3px solid #8B5CF6' }}>
          <div className="stat-header">
            <div className="stat-title">Multiplier Usage</div>
            <div className="stat-icon">⚡</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            {analytics?.multiplierDistribution?.map((item, index) => {
              const total = analytics.multiplierDistribution.reduce((sum, i) => sum + i.count, 0);
              const percentage = ((item.count / total) * 100).toFixed(1);
              
              return (
                <div key={item._id} style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '6px',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      color: '#D1D5DB',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {item._id}x Multiplier
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        color: '#8B5CF6', 
                        fontWeight: '700',
                        fontSize: '16px'
                      }}>
                        {item.count}
                      </span>
                      <span style={{ 
                        color: '#9CA3AF',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
                      borderRadius: '4px',
                      transition: 'width 1s ease',
                      boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: '3px solid #F59E0B' }}>
          <div className="stat-header">
            <div className="stat-title">Avg Session Duration</div>
            <div className="stat-icon">⏱️</div>
          </div>
          <div className="stat-value">{analytics?.avgSessionDuration?.toFixed(2) || 0}h</div>
          <div className="stat-change">Average hours per session</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Top Users by Tokens</h2>
        </div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Wallet Address</th>
              <th>Total Tokens</th>
            </tr>
          </thead>
          <tbody>
            {analytics?.topUsers?.map((user, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
              
              return (
                <tr key={user._id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {index < 3 && <span style={{ fontSize: '20px' }}>{medals[index]}</span>}
                      <span style={{ 
                        background: index < 3 
                          ? `linear-gradient(135deg, ${rankColors[index]}40 0%, ${rankColors[index]}20 100%)`
                          : 'rgba(139, 92, 246, 0.1)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '14px',
                        border: index < 3 ? `1px solid ${rankColors[index]}60` : '1px solid rgba(139, 92, 246, 0.2)',
                        color: index < 3 ? rankColors[index] : '#8B5CF6'
                      }}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td>
                    <code style={{ 
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)', 
                      padding: '8px 12px', 
                      borderRadius: '8px',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}>
                      {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}
                    </code>
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
                </tr>
              );
            })}
          </tbody>
        </table>

        {analytics?.topUsers?.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
            No user data available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
