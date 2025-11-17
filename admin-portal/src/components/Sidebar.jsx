import React from 'react';

const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: '#8B5CF6' },
    { id: 'users', label: 'Users', icon: '👥', color: '#3B82F6' },
    { id: 'sessions', label: 'Mining Sessions', icon: '⛏️', color: '#10B981' },
    { id: 'analytics', label: 'Analytics', icon: '📈', color: '#F59E0B' },
  ];

  return (
    <>
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <span style={{ 
            fontSize: '28px',
            filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))'
          }}>⚡</span>
          Admin Portal
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '12px',
          marginTop: '8px',
          fontWeight: '500',
          letterSpacing: '1px'
        }}>
          Crypto Mining Dashboard
        </p>
      </div>
      
      <nav>
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <a
                href="#"
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item.id);
                }}
                style={{
                  borderLeftColor: currentPage === item.id ? item.color : 'transparent'
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {currentPage === item.id && (
                  <span style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    background: item.color,
                    borderRadius: '50%',
                    boxShadow: `0 0 10px ${item.color}`
                  }}></span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        padding: '16px',
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <p style={{
          color: '#9CA3AF',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '4px'
        }}>
          VERSION
        </p>
        <p style={{
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: '700'
        }}>
          v1.0.0
        </p>
      </div>
    </>
  );
};

export default Sidebar;
