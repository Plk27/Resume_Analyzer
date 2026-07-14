import { Check, CheckCircle2, XCircle, Award, BookOpen, AlertTriangle } from "lucide-react";
import type { AnalysisResult } from "../../hooks/useResumeAnalyzer";

export function SectionsTab({ analysis }: { analysis: AnalysisResult | null }) {
  const a = analysis;
  const sections = a?.sectionAnalysis ?? [];
  const formattingIssues = [
    // Backend only exposes a formattingScore/readability numbers right now.
    // Keep the UI structure but derive content from scores.
    ...(a?.formattingScore !== undefined
      ? [
          {
            ok: a.formattingScore >= 85,
            text: `Formatting score is ${a.formattingScore}/100 — ${
              a.formattingScore >= 85 ? "good" : "review layout for ATS compatibility"}`,
          },
        ]
      : []),
    ...(a?.readability !== undefined
      ? [
          {
            ok: a.readability >= 80,
            text: `Readability is ${a.readability}/100 — ${
              a.readability >= 80 ? "clear" : "improve section clarity and spacing"}`,
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
          <BookOpen size={13} className="text-indigo-400" />
          Resume Sections
        </h3>
        <div className="flex flex-col gap-2">
          {sections.map((s) => (
            <div
              key={s.name}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors
                ${s.present ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-400/20 bg-red-400/5"}
                `}

            >

              {s.present ? (
                <CheckCircle2
                  size={14}
                  className="text-emerald-400 flex-shrink-0"
                />
              ) : (
                <XCircle
                  size={14}
                  className="text-red-400 flex-shrink-0"
                />
              )}
              <span
                className={`text-sm flex-1 ${
                  s.present ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.name}
              </span>
              {!s.present && (
                <span className="text-xs text-red-400 font-medium">
                  Missing
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
          <Award size={13} className="text-indigo-400" />
          Formatting Analysis
        </h3>
        <div className="flex flex-col gap-2">
          {formattingIssues.map((f, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg border
                ${f.ok ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-400/20 bg-amber-400/5"}
                `}
            >

              {f.ok ? (
                <Check
                  size={13}
                  className="text-emerald-400 flex-shrink-0 mt-0.5"
                />
              ) : (
                <AlertTriangle
                  size={13}
                  className="text-amber-400 flex-shrink-0 mt-0.5"
                />
              )}
              <span className="text-sm text-muted-foreground">{f.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-amber-400 font-semibold">ATS Warning:</span> Images and multi-column layouts can cause ATS systems to misparse or skip content. Use a single-column, plain-text layout for maximum compatibility.
          </p>
        </div>
      </div>
    </div>
  );
}
