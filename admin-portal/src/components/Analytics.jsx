import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import RadialProgress from './charts/RadialProgress';

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

  // Prepare chart data
  const statusChartData = analytics?.statusDistribution?.map(item => ({
    label: item._id,
    value: item.count
  })) || [];

  const multiplierChartData = analytics?.multiplierDistribution?.map(item => ({
    label: `${item._id}x`,
    value: item.count
  })) || [];

  return (
    <div>
      <div className="table-container" style={{ 
        marginBottom: '30px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <div className="table-header">
          <h2 className="table-title">📊 Analytics Period</h2>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="search-input"
            style={{ 
              width: '180px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#FFFFFF',
              fontWeight: '600'
            }}
          >
            <option value={7} style={{ background: '#1A1A2E' }}>📅 Last 7 days</option>
            <option value={30} style={{ background: '#1A1A2E' }}>📅 Last 30 days</option>
            <option value={90} style={{ background: '#1A1A2E' }}>📅 Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {/* Status Distribution Pie Chart */}
        <div className="table-container" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
        }}>
          <div style={{ padding: '32px' }}>
            <PieChart
              data={statusChartData}
              title="📊 Session Status Distribution"
              size={220}
            />
          </div>
        </div>

        {/* Multiplier Usage Bar Chart */}
        <div className="table-container" style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
        }}>
          <div style={{ padding: '32px' }}>
            <BarChart
              data={multiplierChartData}
              title="⚡ Multiplier Usage"
              color="#8B5CF6"
              height={300}
            />
          </div>
        </div>
      </div>



      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="stat-card" style={{ borderTop: '3px solid #3B82F6' }}>
          <div className="stat-header">
            <div className="stat-title">Total Sessions</div>
            <div className="stat-icon">📊</div>
          </div>
          <div className="stat-value">
            {analytics?.statusDistribution?.reduce((sum, item) => sum + item.count, 0) || 0}
          </div>
          <div className="stat-change">All mining sessions</div>
        </div>

        <div className="stat-card" style={{ borderTop: '3px solid #10B981' }}>
          <div className="stat-header">
            <div className="stat-title">Active Users</div>
            <div className="stat-icon">👥</div>
          </div>
          <div className="stat-value">
            {analytics?.topUsers?.length || 0}
          </div>
          <div className="stat-change">Top performers</div>
        </div>

        <div className="stat-card" style={{ borderTop: '3px solid #F59E0B' }}>
          <div className="stat-header">
            <div className="stat-title">Avg Duration</div>
            <div className="stat-icon">⏱️</div>
          </div>
          <div className="stat-value">{analytics?.avgSessionDuration?.toFixed(1) || 0}h</div>
          <div className="stat-change">Per session</div>
        </div>

        <div className="stat-card" style={{ borderTop: '3px solid #8B5CF6' }}>
          <div className="stat-header">
            <div className="stat-title">Total Tokens</div>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">
            {analytics?.topUsers?.reduce((sum, user) => sum + user.totalTokens, 0).toFixed(2) || 0}
          </div>
          <div className="stat-change">Earned by top users</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
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

        <div className="stat-card" style={{ 
          borderTop: '3px solid #F59E0B',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px'
        }}>
          <RadialProgress
            value={analytics?.avgSessionDuration || 0}
            maxValue={24}
            label="Avg Session Duration (hours)"
            color="#F59E0B"
            size={140}
          />
        </div>
      </div>

      {/* Top Users Table */}
      <div className="table-container" style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.05) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.1)'
      }}>
        <div className="table-header" style={{
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)'
        }}>
          <h2 className="table-title">🏆 Top Users by Tokens</h2>
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
