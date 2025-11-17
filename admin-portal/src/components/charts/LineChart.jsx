import React, { useState } from 'react';

const LineChart = ({ data, title, color = '#8B5CF6', height = 300 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div style={{ color: '#9CA3AF' }}>No data available</div>;
  }

  const maxValue = Math.max(...data.map(item => item.value), 1);
  const minValue = Math.min(...data.map(item => item.value), 0);
  const range = maxValue - minValue || 1;
  
  const width = 600;
  const chartHeight = height - 80;
  const padding = 40;
  const chartWidth = width - padding * 2;

  // Calculate points
  const points = data.map((item, index) => {
    const x = padding + (chartWidth / (data.length - 1 || 1)) * index;
    const y = chartHeight - ((item.value - minValue) / range) * (chartHeight - padding) + 20;
    return { x, y, ...item };
  });

  // Create path for line
  const linePath = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Create path for area fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${padding} ${chartHeight} Z`;

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
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '20px',
        overflow: 'hidden'
      }}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: 'visible' }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = chartHeight - ((chartHeight - padding) * percent) / 100 + 20;
            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  fill="#6B7280"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {Math.round(minValue + (range * percent) / 100)}
                </text>
              </g>
            );
          })}

          {/* Area fill with gradient */}
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          <path
            d={areaPath}
            fill={`url(#gradient-${color})`}
            style={{
              transition: 'all 0.3s ease'
            }}
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: `drop-shadow(0 0 8px ${color}60)`,
              transition: 'all 0.3s ease'
            }}
          />

          {/* Data points */}
          {points.map((point, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <g key={index}>
                {/* Hover area */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="20"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? "6" : "4"}
                  fill={color}
                  stroke="rgba(15, 15, 35, 0.95)"
                  strokeWidth="2"
                  style={{
                    transition: 'all 0.3s ease',
                    filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none'
                  }}
                />

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={point.x - 40}
                      y={point.y - 50}
                      width="80"
                      height="40"
                      rx="8"
                      fill={color}
                      style={{
                        filter: `drop-shadow(0 4px 12px ${color}60)`
                      }}
                    />
                    <text
                      x={point.x}
                      y={point.y - 35}
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {point.label}
                    </text>
                    <text
                      x={point.x}
                      y={point.y - 20}
                      fill="#FFFFFF"
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {point.value}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* X-axis labels */}
          {points.map((point, index) => {
            // Show every nth label to avoid crowding
            const showLabel = data.length <= 10 || index % Math.ceil(data.length / 10) === 0;
            if (!showLabel) return null;

            return (
              <text
                key={`label-${index}`}
                x={point.x}
                y={chartHeight + 15}
                fill="#9CA3AF"
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
              >
                {point.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default LineChart;
