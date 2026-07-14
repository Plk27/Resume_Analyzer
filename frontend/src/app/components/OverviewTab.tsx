import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Star, AlertTriangle, BarChart2 } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { ProgressBar } from "./ProgressBar";
import { scoreColor } from "../utils/helpers";
import type { AnalysisResult } from "../../hooks/useResumeAnalyzer";

export function OverviewTab({ analysis }: { analysis: AnalysisResult | null }) {
  const a = analysis;
  const subscores = [
    { label: "Keyword Match", value: a?.keywordMatch ?? 0 },
    { label: "Skill Match", value: a?.skillMatch ?? 0 },
    { label: "Experience Match", value: a?.experienceMatch ?? 0 },
    { label: "Education Match", value: a?.educationMatch ?? 0 },
    { label: "Formatting", value: a?.formattingScore ?? 0 },
    { label: "Readability", value: a?.readability ?? 0 },
  ];
  const sectionScores = (a?.sectionAnalysis ?? []).map((s) => {
    // We don't have per-section score from backend; keep a stable 0/100 mapping.
    // Presence is what we can reliably show in this UI.
    return { name: s.name, score: s.present ? 100 : 0 };
  });

  const strengths = a?.strengths ?? [];
  const weaknesses = a?.weaknesses ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <div className="bg-card rounded-2xl border border-border p-7 flex flex-col items-center gap-5">
        <div className="w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Overall ATS Score
          </p>
        </div>
        <ScoreGauge score={a?.atsScore ?? 0} />

        <div className="w-full pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your resume is a <span className="text-emerald-400 font-semibold">strong match</span> for this role. Address the skill gaps to push above 90.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 flex flex-col gap-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Score Breakdown
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subscores.map((s, i) => (
            <ProgressBar key={s.label} label={s.label} value={s.value} delay={i * 0.07} />
          ))}

        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <Star size={13} className="text-emerald-400" />
          Strengths
        </h3>
        <ul className="flex flex-col gap-2.5">
          {strengths.map((s, i) => (

            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <AlertTriangle size={13} className="text-amber-400" />
          Areas to Improve
        </h3>
        <ul className="flex flex-col gap-2.5">
          {weaknesses.map((w, i) => (

            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="text-red-400 flex-shrink-0 mt-0.5">×</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
          <BarChart2 size={13} className="text-indigo-400" />
          Section Scores
        </h3>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart
            data={sectionScores}

            layout="vertical"
            margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#7a8499", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#a0a8b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={76}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: "#0c1227",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
                color: "#f0f2f8",
              }}
              formatter={(v: number) => [`${v}`, "Score"]}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {sectionScores.map((entry, index) => (
                <Cell key={index} fill={scoreColor(entry.score)} />
              ))}

            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
