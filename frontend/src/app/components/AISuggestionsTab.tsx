import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ChevronDown, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import type { AnalysisResult } from "../../hooks/useResumeAnalyzer";

export function AISuggestionsTab({
  analysis,
  expandedAI,
  setExpandedAI,
}: {
  analysis: AnalysisResult | null;
  expandedAI: number | null;
  setExpandedAI: (i: number | null) => void;
}) {

  const suggestions = analysis?.suggestions ?? [];

  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
        <Sparkles size={15} className="text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          These rewrites were generated based on your resume and the target job description. <span className="text-indigo-400 font-semibold">Review and adapt them</span> — they are starting points, not final copy.
        </p>
      </div>

      {suggestions.map((text, i) => {
        const expanded = expandedAI === i;

        return (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpandedAI(expanded ? null : i)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={13} className="text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Suggestion {i + 1}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{text}</p>
                </div>

              </div>
              {expanded ? (
                <ChevronDown size={15} className="text-muted-foreground flex-shrink-0 ml-3" />
              ) : (
                <ChevronRight size={15} className="text-muted-foreground flex-shrink-0 ml-3" />
              )}
            </button>

            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18 }}
                className="border-t border-border"
              >
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4 bg-red-400/5 border border-red-400/15">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2.5">Before</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">(see suggestion)</p>

                  </div>
                  <div className="rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/15">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2.5">After (AI Rewrite)</p>
                    <p className="text-sm text-foreground leading-relaxed">{text}</p>

                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button
                    onClick={() => handleCopy(text, i)}

                    className="w-full py-2.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied === i ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FileText size={14} />
                        Copy Rewritten Version
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
