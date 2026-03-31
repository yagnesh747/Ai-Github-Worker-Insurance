export default function RiskMeter({ score, level }) {
  const radius = 60;
  const stroke = 10;
  const cx = 80;
  const cy = 80;
  const circumference = Math.PI * radius; // half circle

  const clampedScore = Math.max(0, Math.min(100, score));
  const fillLength = (clampedScore / 100) * circumference;
  const gapLength  = circumference - fillLength;

  const colorMap = {
    Low:    '#10b981',
    Medium: '#f59e0b',
    High:   '#ef4444',
  };
  const color = colorMap[level] || '#3b82f6';

  return (
    <div className="risk-meter-wrap">
      <svg
        className="arc-svg"
        width="160"
        height="95"
        viewBox="0 0 160 95"
      >
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#1e2d45"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${fillLength} ${gapLength}`}
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.5s' }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill={color}
          fontSize="22"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
          style={{ transition: 'fill 0.5s' }}
        >
          {clampedScore}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#4a5a7a"
          fontSize="10"
          fontFamily="Inter, sans-serif"
        >
          AI RISK SCORE
        </text>
        {/* Labels */}
        <text x={cx - radius + 2} y={cy + 18} fill="#4a5a7a" fontSize="9" fontFamily="Inter">0</text>
        <text x={cx + radius - 10} y={cy + 18} fill="#4a5a7a" fontSize="9" fontFamily="Inter">100</text>
      </svg>
      <span
        className={`badge badge-${level?.toLowerCase() || 'low'}`}
        style={{ fontSize: '0.85rem', padding: '0.4rem 1.2rem' }}
      >
        {level} Risk
      </span>
    </div>
  );
}
