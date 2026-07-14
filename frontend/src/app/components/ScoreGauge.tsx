import { useEffect, useState } from "react";
import { scoreColor } from "../utils/helpers";

export function ScoreGauge({ score }: { score: number }) {
  const S = 196;
  const r = 76;
  const cx = S / 2;
  const cy = S / 2;
  const circ = 2 * Math.PI * r;
  const color = scoreColor(score);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  const offset = animated ? circ - (score / 100) * circ : circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={S} height={S} className="overflow-visible">
        <defs>
          <filter id="score-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={15}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={15}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#score-glow)"
          style={{
            transition:
              "stroke-dashoffset 1.4s cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="#f0f2f8"
          fontSize={48}
          fontWeight="800"
          fontFamily="'JetBrains Mono', monospace"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="#7a8499"
          fontSize={13}
          fontFamily="'Figtree', sans-serif"
        >
          out of 100
        </text>
      </svg>
      <span
        className="text-xs font-bold tracking-[0.15em] uppercase"
        style={{
          color,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {score >= 80
          ? "Strong Match"
          : score >= 60
          ? "Good Match"
          : "Needs Work"}
      </span>
    </div>
  );
}
