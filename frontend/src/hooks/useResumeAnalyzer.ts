import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { postApi } from "../app/utils/api";

export type StepKey = "upload" | "analyzing" | "results";

export type ProgressItem = {
  title: string;
  detail: string;
};

export type RoadmapItem = { priority: string; items: string[] };

export type SectionAnalysisItem = { name: string; present: boolean };

export type AnalysisResult = {
  atsScore: number;
  keywordMatch: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  formattingScore: number;
  readability: number;
  matchedSkills: string[];
  missingSkills: string[];
  keywordsPresent: string[];
  keywordsMissing: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  roadmap: RoadmapItem[];
  sectionAnalysis: SectionAnalysisItem[];
};

const progressSteps: ProgressItem[] = [
  { title: "Resume uploaded", detail: "Preparing your resume for review" },
  { title: "Parsing content", detail: "Extracting structure and key details" },
  { title: "Extracting skills", detail: "Comparing capabilities against the role" },
  { title: "Matching experience", detail: "Aligning achievements with the job description" },
  { title: "Calculating ATS score", detail: "Scoring readability and keyword fit" },
  { title: "Generating recommendations", detail: "Crafting improvement suggestions" },
];

const supportedFileExtensions = [".pdf", ".docx"];
const maxFileSize = 10 * 1024 * 1024;

function validateFile(file: File) {
  const name = file.name.toLowerCase();
  if (!supportedFileExtensions.some((extension) => name.endsWith(extension))) return "Please upload a PDF or DOCX file.";
  if (file.size > maxFileSize) return "Files must be 10 MB or smaller.";
  return null;
}

function canUseAnalysis(args: {
  resumeFile: File | null;
  resumeText: string;
  jdText: string;
  jdFile: File | null;
}) {
  const { resumeFile, resumeText, jdText, jdFile } = args;
  const hasResume = Boolean(resumeFile) || resumeText.trim().length > 0;
  const hasJD = Boolean(jdFile) || jdText.trim().length > 50;
  return hasResume && hasJD;
}

export function useResumeAnalyzer() {
  const [step, setStep] = useState<StepKey>("upload");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");

  const [jdText, setJdText] = useState<string>("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdFileName, setJdFileName] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [progressIndex, setProgressIndex] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>(progressSteps[0].detail);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  const canAnalyze = useMemo(
    () =>
      canUseAnalysis({ resumeFile, resumeText, jdText, jdFile }),
    [resumeFile, resumeText, jdText, jdFile]
  );

  const uploadResume = useCallback((file: File | undefined) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    setResumeFile(file);
    setResumeFileName(file.name);

    setResumeText("");
  }, []);

  const removeResume = useCallback(() => {
    setResumeFile(null);
    setResumeFileName("");
    setResumeText("");
  }, []);

  const uploadJD = useCallback((file: File | undefined) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    setJdFile(file);
    setJdFileName(file.name);

    setJdText("");
  }, []);

  const removeJD = useCallback(() => {
    setJdFile(null);
    setJdFileName("");
    setJdText("");
  }, []);

  const setJDText = useCallback((text: string) => {
    setJdText(text);
    if (jdFile) {
      setJdFile(null);
      setJdFileName("");
    }
  }, [jdFile]);

  const runProgressStaging = useCallback(async () => {
    abortRef.current = { cancelled: false };

    for (let index = 0; index < progressSteps.length; index += 1) {
      if (abortRef.current.cancelled) return;
      setProgressIndex(index);
      setProgressMessage(progressSteps[index].detail);
      await new Promise((resolve) => window.setTimeout(resolve, 500));
    }

    if (!abortRef.current.cancelled) {
      setProgressIndex(progressSteps.length - 1);
    }
  }, []);

  const analyzeResume = useCallback(async () => {
    if (!canAnalyze || loading) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    abortRef.current.cancelled = false;
    setProgressIndex(0);
    setProgressMessage(progressSteps[0].detail);
    setStep("analyzing");

    const progressPromise = runProgressStaging().catch(() => undefined);

    try {
      if (resumeFile || jdFile) {
        const formData = new FormData();
        if (resumeFile) formData.append("resume", resumeFile);
        if (jdFile) formData.append("job_description", jdFile);

        if (resumeText) formData.append("resume_text", resumeText);
        if (jdText) formData.append("jd_text", jdText);

        const data = await postApi<AnalysisResult>("/upload-analyze", {
          method: "POST",
          body: formData,
        });
        setAnalysis(data);
      } else {
        const data = await postApi<AnalysisResult>("/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText,
            jobDescription: jdText,
          }),
        });
        setAnalysis(data);
      }
      setStep("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStep("upload");
    } finally {
      try {
        await progressPromise;
      } finally {
        setLoading(false);
      }
    }
  }, [canAnalyze, jdFile, jdText, loading, resumeFile, resumeText, runProgressStaging]);

  const downloadImprovedResume = useCallback(() => {
    if (!analysis) return;

    const blob = new Blob([
      `\
AI Resume Analyzer Report\
========================\
ATS Score: ${analysis.atsScore}/100\
Keyword Match: ${analysis.keywordMatch}%\
Skill Match: ${analysis.skillMatch}%\
Experience Match: ${analysis.experienceMatch}%\
Education Match: ${analysis.educationMatch}%\
Formatting Score: ${analysis.formattingScore}%\
Readability: ${analysis.readability}%\
\
Matched Skills:\
${analysis.matchedSkills.join(", ")}\
\
Missing Skills:\
${analysis.missingSkills.join(", ")}\
\
Keywords Present:\
${analysis.keywordsPresent.join(", ")}\
\
Keywords Missing:\
${analysis.keywordsMissing.join(", ")}\
\
Suggestions:\
${analysis.suggestions.join("\n")}\
`,
    ], { type: "text/plain;charset=utf-8" });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "resume-analysis-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [analysis]);

  const reset = useCallback(() => {
    abortRef.current.cancelled = true;
    setStep("upload");

    setResumeFile(null);
    setResumeFileName("");
    setResumeText("");

    setJdText("");
    setJdFile(null);
    setJdFileName("");

    setLoading(false);
    setProgressIndex(0);
    setProgressMessage(progressSteps[0].detail);

    setAnalysis(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (step !== "analyzing") {
      abortRef.current.cancelled = true;
    }
  }, [step]);

  return {
    step,
    setStep,

    resumeFile,
    resumeFileName,
    resumeText,

    jdText,
    jdFile,
    jdFileName,

    uploadResume,
    uploadJD,

    removeResume,
    removeJD,

    setJDText,

    analyzeResume,

    loading,
    progress: {
      index: progressIndex,
      message: progressMessage,
      percent: ((progressIndex + 1) / progressSteps.length) * 100,
      steps: progressSteps,
    },

    analysis,

    downloadImprovedResume,

    reset,

    error,

    canAnalyze,
  };
}

