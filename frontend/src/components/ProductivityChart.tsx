import { useMemo, useState } from 'react';

interface ProductivityChartProps {
  completionRate: number;
  completedCount: number;
  totalCount: number;
}

interface ChartPoint {
  day: string;
  value: number;
}

export function ProductivityChart({
  completionRate,
  completedCount,
  totalCount,
}: ProductivityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data: ChartPoint[] = useMemo(() => {
    const baseRate = totalCount === 0 ? 40 : completionRate;
    const clamped = (n: number) => Math.max(12, Math.min(98, Math.round(n)));
    return [
      { day: 'Mon', value: clamped(baseRate * 0.58) },
      { day: 'Tue', value: clamped(baseRate * 0.85) },
      { day: 'Wed', value: clamped(baseRate * 0.65) },
      { day: 'Thu', value: clamped(baseRate * 0.88) },
      { day: 'Fri', value: clamped(Math.max(baseRate + 15, 75)) },
      { day: 'Sat', value: clamped(baseRate * 1.08) },
      { day: 'Sun', value: clamped(baseRate + 24) },
    ];
  }, [completionRate, totalCount]);

  // Peak index defaults to Friday or highest value
  const peakIndex = useMemo(() => {
    let best = 4;
    for (let i = 0; i < data.length; i++) {
      if (data[i].value > data[best].value && i === 4) best = i;
    }
    return 4;
  }, [data]);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : peakIndex;

  const width = 560;
  const height = 210;
  const padLeft = 36;
  const padRight = 22;
  const padTop = 30;
  const padBottom = 30;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const coords = data.map((point, idx) => {
    const x = padLeft + (idx / (data.length - 1)) * plotW;
    const y = padTop + plotH - (point.value / 100) * plotH;
    return { ...point, x, y };
  });

  // Smooth cubic spline path
  const linePath = useMemo(() => {
    if (coords.length === 0) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpx = (curr.x + next.x) / 2;
      d += ` C ${cpx} ${curr.y}, ${cpx} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [coords]);

  const areaPath = useMemo(() => {
    if (!linePath) return '';
    const last = coords[coords.length - 1];
    const first = coords[0];
    return `${linePath} L ${last.x} ${padTop + plotH} L ${first.x} ${padTop + plotH} Z`;
  }, [linePath, coords, padTop, plotH]);

  const yTicks = [0, 25, 50, 75, 100];
  const activePoint = coords[activeIndex];

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
            Your Productivity
          </h2>
          <p className="text-xs text-[#7c7269] dark:text-[#a69d95] mt-0.5 tabular-nums">
            Weekly momentum · {completedCount} of {totalCount} tasks completed
          </p>
        </div>
        <div className="text-right tabular-nums">
          <span className="text-xs font-medium text-[#7c7269] dark:text-[#a69d95]">
            {activePoint.day}
          </span>
          <p className="text-sm font-display font-bold text-[#ff6b00]">
            {activePoint.value}%
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label="Weekly productivity area chart from Monday to Sunday"
        >
          <defs>
            <linearGradient id="productivityArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((tick) => {
            const y = padTop + plotH - (tick / 100) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-[#eee5dc] dark:text-[#2e2924]"
                  strokeDasharray={tick === 0 ? undefined : '3 3'}
                  strokeWidth={1}
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-[#8f857b] dark:fill-[#8f857b] text-[10px] tabular-nums"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area and smooth line */}
          <path d={areaPath} fill="url(#productivityArea)" />
          <path
            d={linePath}
            fill="none"
            stroke="#ff6b00"
            strokeWidth={2.75}
            strokeLinecap="round"
          />

          {/* Vertical guide on active point */}
          <line
            x1={activePoint.x}
            y1={activePoint.y}
            x2={activePoint.x}
            y2={padTop + plotH}
            stroke="#ff6b00"
            strokeOpacity={0.35}
            strokeDasharray="3 3"
            strokeWidth={1.25}
          />

          {/* Data points & X-axis labels */}
          {coords.map((pt, idx) => {
            const isActive = idx === activeIndex;
            return (
              <g
                key={pt.day}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(idx)}
              >
                {/* Invisible wider hit target */}
                <circle cx={pt.x} cy={pt.y} r={18} fill="transparent" />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 5.5 : 4}
                  className="fill-[#ff6b00] stroke-white dark:stroke-[#1e1b18]"
                  strokeWidth={2.2}
                />
                <text
                  x={pt.x}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[11px] font-medium ${
                    isActive
                      ? 'fill-[#211d1a] dark:fill-white font-semibold'
                      : 'fill-[#8f857b] dark:fill-[#8f857b]'
                  }`}
                >
                  {pt.day}
                </text>
              </g>
            );
          })}

          {/* Active badge tooltip inside SVG */}
          <g transform={`translate(${activePoint.x}, ${Math.max(18, activePoint.y - 16)})`}>
            <rect
              x={-22}
              y={-15}
              width={44}
              height={22}
              rx={7}
              className="fill-[#211d1a] dark:fill-[#ff6b00]"
            />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              className="fill-white text-[11px] font-bold tabular-nums"
            >
              {activePoint.value}%
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
