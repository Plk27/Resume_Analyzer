import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Brain,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";
import { formatFileSize } from "../utils/helpers";

type Props = {
  resumeFile: File | null;
  resumeFileName: string;

  jdText: string;
  jdFile: File | null;
  jdFileName: string;

  canAnalyze: boolean;
  loading: boolean;
  error: string | null;

  onAnalyze: () => void;
  setJDText: (text: string) => void;

  uploadResume: (file: File | undefined) => void;
  uploadJD: (file: File | undefined) => void;

};

export function UploadView({
  resumeFile,
  resumeFileName,
  jdText,
  jdFile,
  jdFileName,
  canAnalyze,
  loading,
  error,
  onAnalyze,
  setJDText,
  uploadResume,
  uploadJD,
}: Props) {
  const [resumeDrag, setResumeDrag] = useState(false);
  const [jdDrag, setJdDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  const handleResumeDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setResumeDrag(false);
      const file = e.dataTransfer.files?.[0];
      uploadResume(file);
    },
    [uploadResume]
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      <header className="px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Brain size={15} className="text-indigo-400" />
        </div>
        <span
          className="font-bold text-sm tracking-tight"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          ResumeAI
        </span>
        <span className="ml-auto text-xs text-muted-foreground hidden sm:block">
          AI-Powered ATS Analysis — Free
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="text-center mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-6">
            <Sparkles size={11} />
            Skill Gap Analysis · ATS Scoring · AI Rewrites
          </div>
          <h1
            className="text-4xl lg:text-5xl font-black text-foreground leading-[1.08] mb-5"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Know exactly how your
            <br />
            <span
              style={{
                background: "linear-gradient(125deg, #818cf8 0%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              resume scores
            </span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Upload your resume and paste the job description. Get a full
            ATS compatibility report with skill gap analysis and AI-powered
            rewrite suggestions in seconds.
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          <div
            className={`relative rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 min-h-[220px]
              ${
                resumeDrag
                  ? "border-indigo-400 bg-indigo-500/10"
                  : resumeFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-border bg-card hover:border-indigo-500/40 hover:bg-indigo-500/5"
              }`}
            onDragOver={(e) => {
              e.preventDefault();
              setResumeDrag(true);
            }}
            onDragLeave={() => setResumeDrag(false)}
            onDrop={handleResumeDrop}
            onClick={() => !loading && fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (!loading && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={loading ? -1 : 0}
            aria-label="Upload resume as a PDF or DOCX file"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => uploadResume(e.target.files?.[0])}
            />

            {resumeFile ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={22} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground text-sm">
                    {resumeFileName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {resumeFile.size ? formatFileSize(resumeFile.size) : "Uploaded"} · Click to change
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <Upload size={20} className="text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground text-sm">
                    Upload Resume
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF or DOCX · Drag & drop or click
                  </p>
                </div>
              </>
            )}
          </div>

          <div
            className={`rounded-xl border bg-card flex flex-col p-4 min-h-[220px] transition-colors ${jdDrag ? "border-indigo-400 bg-indigo-500/10" : "border-border"}`}
            onDragOver={(event) => {
              event.preventDefault();
              setJdDrag(true);
            }}
            onDragLeave={() => setJdDrag(false)}
            onDrop={(event) => {
              event.preventDefault();
              setJdDrag(false);
              uploadJD(event.dataTransfer.files?.[0]);
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText size={13} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Job Description
              </span>
            </div>
            <input ref={jdFileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={(event) => uploadJD(event.target.files?.[0])} />
            <textarea
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground resize-none outline-none leading-relaxed"
              placeholder={
                "Paste the job description here…\n\nInclude required skills, responsibilities, and qualifications for the most accurate analysis."
              }
              value={jdText}
              disabled={loading}
              onChange={(e) => setJDText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
              <button type="button" onClick={() => jdFileInputRef.current?.click()} disabled={loading} className="text-xs text-indigo-400 hover:text-indigo-300 disabled:cursor-not-allowed">
                {jdFile ? `Replace ${jdFileName}` : "Upload JD"}
              </button>
              {jdText.length > 0 && jdText.length < 50 && (
                <span className="text-xs text-amber-400">
                  Add more detail for better results
                </span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          <button
            onClick={onAnalyze}
            disabled={!canAnalyze || loading}
            className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200
              ${
                canAnalyze && !loading
                  ? "bg-indigo-500 hover:bg-indigo-400 text-white cursor-pointer shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
                  : "bg-white/[0.06] text-muted-foreground cursor-not-allowed"
              }`}
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            <Brain size={15} />
            {loading ? "Analyzing…" : "Analyze Resume"}
            {canAnalyze && !loading && <ChevronRight size={15} />}
          </button>

          {!canAnalyze && (
            <p className="text-xs text-muted-foreground">
              {resumeFile
                ? "Add a job description to continue (min. 50 characters)"
                : "Upload a resume to continue"}
            </p>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-x-5 gap-y-2 justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            "ATS Score",
            "Skill Gap Analysis",
            "Keyword Match",
            "AI Rewrite Suggestions",
            "Improvement Roadmap",
          ].map((f) => (
            <span
              key={f}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Check size={10} className="text-emerald-400" />
              {f}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

