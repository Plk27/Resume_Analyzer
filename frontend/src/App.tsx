import { AnimatePresence, motion } from "motion/react";

import { UploadView } from "./app/components/UploadView";
import { AnalyzingView } from "./app/components/AnalyzingView";
import { ResultsView } from "./app/components/ResultsView";
import { useResumeAnalyzer } from "./hooks/useResumeAnalyzer";

export default function App() {
  const {
    step,

    resumeFile,
    resumeFileName,
    jdText,
    jdFile,
    jdFileName,

    uploadResume,
    uploadJD,

    setJDText,

    analyzeResume,

    loading,
    progress,

    analysis,

    downloadImprovedResume,

    reset,

    error,

    canAnalyze,
  } = useResumeAnalyzer();

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UploadView
              resumeFile={resumeFile}
              resumeFileName={resumeFileName}
              jdText={jdText}
              jdFile={jdFile}
              jdFileName={jdFileName}
              canAnalyze={canAnalyze}
              loading={loading}
              error={error}

              onAnalyze={analyzeResume}
              setJDText={setJDText}

              uploadResume={uploadResume}
              uploadJD={uploadJD}
            />
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AnalyzingView loading={loading} progress={progress} />
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ResultsView
              analysis={analysis}
              progress={progress}
              onReset={reset}
              onDownload={downloadImprovedResume}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
