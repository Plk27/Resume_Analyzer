import { motion } from "motion/react";
import { Brain, CheckCircle2 } from "lucide-react";

export function AnalyzingView({
  loading,
  progress,
}: {
  loading: boolean;
  progress: {
    index: number;
    message: string;
    percent: number;
    steps: { title: string; detail: string }[];
  };
}) {
  const step = Math.max(0, Math.min(progress.index, progress.steps.length - 1));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-10 px-4"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      <div className="text-center">
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-indigo-500/30 flex items-center justify-center">
            <Brain size={26} className="text-indigo-400" />
          </div>
        </div>
        <h2
          className="text-2xl font-black text-foreground mb-2"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          Analyzing your resume
        </h2>
        <p className="text-muted-foreground text-sm">
          {loading ? "This takes just a few seconds" : "Finalizing results…"}
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {progress.steps.map((s, i) => {
          const state =
            i < step ? "done" : i === step ? "active" : "pending";

          return (
            <motion.div
              key={s.title}
              className={`flex items-start gap-3 p-3.5 rounded-xl transition-all duration-300
                ${
                  state === "active"
                    ? "bg-indigo-500/10 border border-indigo-500/30"
                    : state === "done"
                    ? "opacity-50"
                    : "opacity-25"
                }`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: state === "pending" ? 0.25 : 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                {state === "done" ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : state === "active" ? (
                  <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    state === "done" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {s.title}
                </p>
                {state === "active" && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.detail}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {progress.message ? (
        <p className="text-xs text-muted-foreground mt-1">{progress.message}</p>
      ) : null}
    </div>
  );
}

