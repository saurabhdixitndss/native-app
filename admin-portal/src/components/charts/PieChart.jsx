import React from 'react';

const PieChart = ({ data, title, size = 200 }) => {
  if (!data || data.length === 0) {
    return <div style={{ color: '#9CA3AF' }}>No data available</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const colors = [
    '#8B5CF6', // Purple
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];

  let currentAngle = -90; // Start from top
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Calculate path for SVG
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      pathData,
      color: colors[index % colors.length],
      label: item.label,
      value: item.value,
      percentage: percentage.toFixed(1)
    };
  });

  return (
    <div style={{ width: '100%' }}>
      {title && (
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {title}
        </h3>
      )}
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap'
      }}>
        {/* SVG Pie Chart */}
        <svg
          width={size}
          height={size}
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
            transition: 'transform 0.3s ease'
          }}
        >
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: 0.9
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.filter = `drop-shadow(0 0 10px ${segment.color})`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.filter = 'none';
                }}
              >
                <title>{`${segment.label}: ${segment.value} (${segment.percentage}%)`}</title>
              </path>
            </g>
          ))}
          
          {/* Center circle for donut effect */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 4}
            fill="rgba(15, 15, 35, 0.95)"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="2"
          />
          
          {/* Total in center */}
          <text
            x={size / 2}
            y={size / 2 - 5}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="12"
            fontWeight="600"
          >
            TOTAL
          </text>
          <text
            x={size / 2}
            y={size / 2 + 15}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="20"
            fontWeight="700"
          >
            {total}
          </text>
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {segments.map((segment, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: segment.color,
                  boxShadow: `0 0 10px ${segment.color}60`
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  color: '#D1D5DB',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {segment.label}
                </div>
                <div style={{
                  color: '#9CA3AF',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {segment.percentage}%
                </div>
              </div>
              <div style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700'
              }}>
                {segment.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
