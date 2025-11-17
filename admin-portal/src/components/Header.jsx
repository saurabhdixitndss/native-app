import React from 'react';

const Header = ({ currentPage }) => {
  const getPageInfo = (page) => {
    const pages = {
      dashboard: { 
        title: 'Dashboard', 
        subtitle: 'Overview of your mining platform',
        icon: '📊'
      },
      users: { 
        title: 'User Management', 
        subtitle: 'Manage and monitor registered users',
        icon: '👥'
      },
      sessions: { 
        title: 'Mining Sessions', 
        subtitle: 'Track active and completed mining sessions',
        icon: '⛏️'
      },
      analytics: { 
        title: 'Analytics & Reports', 
        subtitle: 'Insights and performance metrics',
        icon: '📈'
      }
    };
    return pages[page] || { title: 'Admin Portal', subtitle: '', icon: '⚡' };
  };

  const pageInfo = getPageInfo(currentPage);
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ 
              fontSize: window.innerWidth < 768 ? '24px' : '32px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}>
              {pageInfo.icon}
            </span>
            <h1 className="header-title" style={{
              fontSize: window.innerWidth < 768 ? '18px' : undefined
            }}>
              {pageInfo.title}
            </h1>
          </div>
          {window.innerWidth >= 768 && (
            <p style={{
              color: '#9CA3AF',
              fontSize: '14px',
              fontWeight: '500',
              marginLeft: '44px'
            }}>
              {pageInfo.subtitle}
            </p>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            padding: '10px 16px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>🕐</span>
            <span style={{
              color: '#D1D5DB',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {currentTime}
            </span>
          </div>
          
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          }}
          title="Admin Profile"
          >
            👤
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
