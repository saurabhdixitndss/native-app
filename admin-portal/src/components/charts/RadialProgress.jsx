import React from 'react';

const RadialProgress = ({ value, maxValue, label, color = '#8B5CF6', size = 150 }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{ position: 'relative' }}>
        <svg
          width={size}
          height={size}
          style={{
            transform: 'rotate(-90deg)',
            filter: `drop-shadow(0 0 10px ${color}40)`
          }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="12"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1s ease',
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '900',
            color: color,
            lineHeight: '1',
            marginBottom: '4px'
          }}>
            {value.toFixed(1)}
          </div>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>

      {label && (
        <div style={{
          color: '#D1D5DB',
          fontSize: '14px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default RadialProgress;
