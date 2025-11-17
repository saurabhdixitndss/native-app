import React, { useState } from 'react';

const BarChart = ({ data, title, color = '#8B5CF6', height = 300 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ color: '#9CA3AF' }}>No data available</div>;
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const chartHeight = height - 60; // Reserve space for labels

  return (
    <div style={{ width: '100%' }}>
      {title && (
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          {title}
        </h3>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: `${chartHeight}px`,
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative'
      }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            style={{
              position: 'absolute',
              left: '20px',
              right: '20px',
              bottom: `${20 + (chartHeight - 40) * (percent / 100)}px`,
              height: '1px',
              background: 'rgba(255, 255, 255, 0.05)',
              pointerEvents: 'none'
            }}
          >
            <span style={{
              position: 'absolute',
              left: '-40px',
              top: '-8px',
              color: '#6B7280',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              {Math.round((maxValue * percent) / 100)}
            </span>
          </div>
        ))}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (chartHeight - 40);
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                maxWidth: '80px',
                position: 'relative'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Value tooltip */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: `${barHeight + 10}px`,
                  background: color,
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: `0 4px 12px ${color}60`,
                  animation: 'fadeIn 0.2s ease',
                  whiteSpace: 'nowrap',
                  zIndex: 10
                }}>
                  {item.value}
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '8px',
                    background: color,
                    transform: 'translateX(-50%) rotate(45deg)'
                  }} />
                </div>
              )}

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: `${barHeight}px`,
                  background: isHovered
                    ? `linear-gradient(180deg, ${color} 0%, ${color}CC 100%)`
                    : `linear-gradient(180deg, ${color}CC 0%, ${color}80 100%)`,
                  borderRadius: '8px 8px 0 0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: isHovered ? `0 0 20px ${color}60` : 'none',
                  transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Shine effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: isHovered ? 'shine 1s ease' : 'none'
                }} />
              </div>

              {/* Label */}
              <div style={{
                marginTop: '8px',
                color: isHovered ? '#FFFFFF' : '#9CA3AF',
                fontSize: '12px',
                fontWeight: '600',
                textAlign: 'center',
                transition: 'color 0.3s ease',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shine {
          from { left: -100%; }
          to { left: 200%; }
        }
      `}</style>
    </div>
  );
};

export default BarChart;
