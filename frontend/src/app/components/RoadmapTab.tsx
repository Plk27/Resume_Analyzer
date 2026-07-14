import { Brain } from "lucide-react";
import type { AnalysisResult } from "../../hooks/useResumeAnalyzer";

export function RoadmapTab({ analysis }: { analysis: AnalysisResult | null }) {
  const roadmap = analysis?.roadmap ?? [];

  const priorities = [
    {
      key: "high" as const,
      label: "High Priority",
      color: "#f87171",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
    {
      key: "medium" as const,
      label: "Medium Priority",
      color: "#fbbf24",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    {
      key: "low" as const,
      label: "Low Priority",
      color: "#818cf8",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  ];

  const itemsFor = (priority: (typeof priorities)[number]["key"]) => {
    const entry = roadmap.find((r) => r.priority.toLowerCase() === priority);
    return entry?.items ?? [];
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-3">
        <Brain size={15} className="text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">
            Your personalized improvement roadmap
          </p>
          <p className="text-sm text-muted-foreground">
            Based on your skill gap and the target JD, here are the highest-impact actions to take before reapplying.
          </p>
        </div>
      </div>

      {priorities.map(({ key, label, color, bg, border }) => {
        const items = itemsFor(key);
        return (
          <div key={key} className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <h3 className="font-bold text-sm" style={{ color }}>
                {label}
              </h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {items.length} actions
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${bg} ${border}`}
                >
                  <div
                    className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                    style={{
                      borderColor: color + "50",
                      color,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

