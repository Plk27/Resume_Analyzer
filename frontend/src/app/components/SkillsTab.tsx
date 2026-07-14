import { BarChart2, CheckCircle2, XCircle } from "lucide-react";
import { Chip } from "./Chip";
import { ProgressBar } from "./ProgressBar";
import type { AnalysisResult } from "../../hooks/useResumeAnalyzer";

export function SkillsTab({ analysis }: { analysis: AnalysisResult | null }) {
  const a = analysis;
  const matchedSkills = a?.matchedSkills ?? [];
  const missingSkills = a?.missingSkills ?? [];
  const total = matchedSkills.length + missingSkills.length;
  const matchPct = total > 0 ? Math.round((matchedSkills.length / total) * 100) : 0;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-400" />
            Skills Found
          </h3>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {matchedSkills.length} matched

          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.map((s) => (
            <Chip key={s} label={s} type="success" />
          ))}

        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <XCircle size={13} className="text-red-400" />
            Missing Skills
          </h3>
          <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
            {missingSkills.length} missing

          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((s) => (
            <Chip key={s} label={s} type="error" />
          ))}

        </div>
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Adding these skills could increase your match score by an estimated <span className="text-amber-400 font-semibold">+12 points</span>.
          </p>
        </div>
      </div>

      <div className="md:col-span-2 bg-card rounded-2xl border border-border p-6">
        <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
          <BarChart2 size={13} className="text-indigo-400" />
          Skill Match Overview
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Required",
              value: total,
              color: "#818cf8",
            },
            {
              label: "Matched",
              value: matchedSkills.length,

              color: "#34d399",
            },
            {
              label: "Missing",
              value: missingSkills.length,

              color: "#f87171",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl"
              style={{ background: stat.color + "12" }}
            >
              <p
                className="text-3xl font-black mb-1"
                style={{
                  color: stat.color,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <ProgressBar label={`Overall Skill Coverage — ${matchPct}%`} value={matchPct} />
      </div>
    </div>
  );
}
