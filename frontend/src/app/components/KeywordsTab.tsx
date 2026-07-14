import { Check, X, Target } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import type { AnalysisResult } from "../../hooks/useResumeAnalyzer";

export function KeywordsTab({ analysis }: { analysis: AnalysisResult | null }) {
  const a = analysis;
  const keywordsPresent = a?.keywordsPresent ?? [];
  const keywordsMissing = a?.keywordsMissing ?? [];
  const total = keywordsPresent.length + keywordsMissing.length;
  const pct = total > 0 ? Math.round((keywordsPresent.length / total) * 100) : 0;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Check size={13} className="text-emerald-400" />
            Keywords Present
          </h3>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {keywordsPresent.length} found

          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywordsPresent.map((k) => (

            <span
              key={k}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              <Check size={10} />
              {k}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <X size={13} className="text-red-400" />
            Keywords Missing
          </h3>
          <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
            {keywordsMissing.length} missing

          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywordsMissing.map((k) => (

            <span
              key={k}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20"
            >
              <X size={10} />
              {k}
            </span>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 bg-card rounded-2xl border border-border p-6">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
          <Target size={13} className="text-indigo-400" />
          Keyword Density
        </h3>
          <p className="text-xs text-muted-foreground mb-5">
          Your resume contains <span className="text-indigo-400 font-semibold">{keywordsPresent.length}</span> of {total} keywords extracted from the job description.
        </p>

        <ProgressBar
          label={`Keyword Match Rate — ${pct}%`}
          value={pct}
        />
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-amber-400 font-semibold">Tip:</span> Naturally weave missing keywords into your experience descriptions and project summaries. Keyword stuffing is detected by modern ATS systems — always tie keywords to real experience.
          </p>
        </div>
      </div>
    </div>
  );
}
