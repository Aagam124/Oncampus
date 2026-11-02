import React, { useState } from 'react';

// 1. Area Trend Chart (Interactive SVG)
export function AreaTrendChart({ data = [], height = 220, color = '#0071e3', label = 'Value', valuePrefix = '' }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-[#94a3b8]">
        No trend data recorded for this timeframe
      </div>
    );
  }

  const values = data.map((d) => d.count !== undefined ? d.count : d.amount || 0);
  const maxVal = Math.max(...values, 5);
  const minVal = 0;
  const paddingX = 20;
  const paddingY = 25;
  const width = 600;

  const points = data.map((d, i) => {
    const val = d.count !== undefined ? d.count : d.amount || 0;
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (val / maxVal) * (height - 2 * paddingY);
    return { x, y, val, label: d._id || d.date };
  });

  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - paddingY - pct * (height - 2 * paddingY);
          return (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="currentColor"
              className="text-black/[0.04] dark:text-white/[0.06]"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Gradient Area */}
        <path d={areaD} fill={`url(#gradient-${color.replace('#', '')})`} />

        {/* Trend Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredIdx === i ? 5 : 3}
            fill={hoveredIdx === i ? '#ffffff' : color}
            stroke={color}
            strokeWidth={hoveredIdx === i ? 2.5 : 1.5}
            className="cursor-pointer transition-all duration-150"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          className="absolute z-10 -translate-x-1/2 -top-1 bg-[#0f172a] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg pointer-events-none"
          style={{ left: `${(points[hoveredIdx].x / width) * 100}%` }}
        >
          <div className="text-[9px] text-[#94a3b8]">{points[hoveredIdx].label}</div>
          <div>{valuePrefix}{points[hoveredIdx].val.toLocaleString()} {label}</div>
        </div>
      )}
    </div>
  );
}

// 2. Bar Chart Component
export function BarChart({ data = [], height = 200, color = '#0071e3', valuePrefix = '' }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-[#94a3b8]">
        No distribution data
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.count || 0), 1);

  return (
    <div className="flex items-end gap-2 h-44 pt-4 px-2">
      {data.map((d, i) => {
        const heightPct = Math.max(((d.count || 0) / maxVal) * 100, 6);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
            {/* Tooltip on hover */}
            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
              {valuePrefix}{d.count?.toLocaleString()}
            </div>

            <div className="w-full bg-[#f1f5f9] dark:bg-[#1e293b] rounded-t-lg h-36 flex items-end overflow-hidden">
              <div
                className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="text-[10px] font-medium text-[#64748b] dark:text-[#94a3b8] truncate max-w-[50px]">
              {d._id?.slice(5) || d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// 3. Donut Distribution Chart
export function DonutChart({ segments = [], size = 160 }) {
  const total = segments.reduce((sum, s) => sum + (s.count || 0), 0);

  if (total === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-xs text-[#94a3b8]">
        No active orders recorded
      </div>
    );
  }

  let accumulated = 0;
  const radius = 60;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 160 160" className="-rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-black/[0.04] dark:text-white/[0.06]"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, i) => {
            const count = seg.count || 0;
            const pct = count / total;
            const strokeDashoffset = circumference * (1 - accumulated);
            const strokeDasharray = `${circumference * pct} ${circumference * (1 - pct)}`;
            accumulated += pct;

            return (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color || '#0071e3'}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={-circumference * (accumulated - pct)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Center count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-[#0f172a] dark:text-white leading-none">
            {total}
          </span>
          <span className="text-[10px] uppercase font-bold text-[#94a3b8] mt-0.5">
            Orders
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5 text-xs">
        {segments.map((s, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[#64748b] dark:text-[#94a3b8] capitalize">{s.label || s._id}:</span>
            <span className="font-bold text-[#0f172a] dark:text-white">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Horizontal Skills Progress Rankings
export function SkillsRankings({ skills = [] }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-xs text-[#94a3b8]">
        No student skills recorded yet
      </div>
    );
  }

  const maxCount = Math.max(...skills.map((s) => s.count), 1);

  return (
    <div className="space-y-3">
      {skills.map((s, i) => {
        const pct = Math.round((s.count / maxCount) * 100);
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#0f172a] dark:text-white">{s._id}</span>
              <span className="text-[#64748b] dark:text-[#94a3b8]">{s.count} students</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f1f5f9] dark:bg-[#1e293b] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0071e3] to-[#38bdf8] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
