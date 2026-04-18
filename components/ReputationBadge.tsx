interface ReputationBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ReputationBadge({ score, size = "md" }: ReputationBadgeProps) {
  const sizes = {
    sm: { ring: 36, stroke: 3, text: "text-[11px]" },
    md: { ring: 48, stroke: 3, text: "text-[13px]" },
    lg: { ring: 64, stroke: 3.5, text: "text-[15px]" },
  };
  const s = sizes[size];
  const r = (s.ring - s.stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 1000) * c;
  const center = s.ring / 2;
  const color = score >= 800 ? "#b7d941" : score >= 500 ? "#4ea8f6" : score >= 200 ? "#e8a830" : "#666668";

  return (
    <div className="inline-flex items-center gap-2">
      <svg width={s.ring} height={s.ring} className="-rotate-90">
        <circle cx={center} cy={center} r={r} stroke="#2a2a2b" strokeWidth={s.stroke} fill="none" />
        <circle
          cx={center} cy={center} r={r}
          stroke={color} strokeWidth={s.stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div>
        <span className={`font-mono font-semibold ${s.text}`} style={{ color }}>{score}</span>
        <span className="text-text-3 text-[10px] ml-0.5">/ 1,000</span>
      </div>
    </div>
  );
}
