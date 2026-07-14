import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const defaultResult: AnalysisResult = {
  atsScore: 84,
  keywordMatch: 92,
  skillMatch: 80,
  experienceMatch: 75,
  educationMatch: 100,
  formattingScore: 95,
  readability: 90,
  matchedSkills: ["Python", "SQL", "Machine Learning", "Pandas", "Git"],
  missingSkills: ["Docker", "AWS", "Kubernetes", "FastAPI"],
  keywordsPresent: ["Machine Learning", "Python", "Classification", "TensorFlow"],
  keywordsMissing: ["Deployment", "Cloud", "Optimization", "Docker"],
  strengths: [
    "Strong technical skill section",
    "Good project diversity",
    "Relevant education",
    "Contains measurable achievements",
  ],
  weaknesses: [
    "Projects lack measurable impact",
    "No certifications included",
    "Experience descriptions are generic",
    "LinkedIn missing",
  ],
  suggestions: [
    "Add quantified impact in each project bullet.",
    "Tailor your summary to the target role and include the top 3 keywords.",
    "Add a compact certifications section with relevant cloud or platform credentials.",
  ],
  roadmap: [
    { priority: "High", items: ["Learn Docker", "Add FastAPI project", "Include measurable achievements"] },
    { priority: "Medium", items: ["Add certifications", "Improve GitHub README"] },
    { priority: "Low", items: ["Portfolio website", "LinkedIn optimization"] },
  ],
  sectionAnalysis: [
    { name: "Contact Information", present: true },
    { name: "Summary", present: true },
    { name: "Experience", present: true },
    { name: "Projects", present: true },
    { name: "Education", present: true },
    { name: "Skills", present: true },
    { name: "Certifications", present: false },
    { name: "Achievements", present: false },
  ],
};

function fileIsText(file: File) {
  return (
    file.type.startsWith("text/") ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".md")
  );
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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

    setError(null);

    setResumeFile(file);
    setResumeFileName(file.name);

    if (fileIsText(file)) {
      const reader = new FileReader();
      reader.onload = () => setResumeText(String(reader.result ?? ""));
      reader.readAsText(file);
    } else {
      setResumeText("");
    }
  }, []);

  const removeResume = useCallback(() => {
    setResumeFile(null);
    setResumeFileName("");
    setResumeText("");
  }, []);

  const uploadJD = useCallback((file: File | undefined) => {
    if (!file) return;

    setError(null);

    setJdFile(file);
    setJdFileName(file.name);

    // Keep behavior aligned with old app: JD can be uploaded as a file or pasted.
    // If JD is a text-like file, we read it; otherwise we rely on the file upload.
    if (fileIsText(file)) {
      const reader = new FileReader();
      reader.onload = () => setJdText(String(reader.result ?? ""));
      reader.readAsText(file);
    }
  }, []);

  const removeJD = useCallback(() => {
    setJdFile(null);
    setJdFileName("");
    setJdText("");
  }, []);

  // If user starts typing JD, ensure we treat it as the active JD input (clear file)
  // while keeping UI behavior consistent.
  const setJDText = useCallback((text: string) => {
    setJdText(text);
    if (jdFile) {
      setJdFile(null);
      setJdFileName("");
    }
  }, [jdFile]);

  const runProgressStaging = useCallback(async () => {
    // Staged progress, mirroring frontend_old behavior.
    abortRef.current = { cancelled: false };

    for (let index = 0; index < progressSteps.length; index += 1) {
      if (abortRef.current.cancelled) return;
      setProgressIndex(index);
      setProgressMessage(progressSteps[index].detail);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => window.setTimeout(resolve, 500));
    }

    if (!abortRef.current.cancelled) {
      setProgressIndex(progressSteps.length - 1);
    }
  }, []);

  const analyzeResume = useCallback(async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    abortRef.current.cancelled = false;
    setProgressIndex(0);
    setProgressMessage(progressSteps[0].detail);
    setStep("analyzing");

    // Progress staging runs in parallel with API request.
    const progressPromise = runProgressStaging().catch(() => undefined);

    try {
      let response: Response;

      if (resumeFile || jdFile) {
        const formData = new FormData();
        if (resumeFile) formData.append("resume", resumeFile);
        if (jdFile) formData.append("job_description", jdFile);

        if (resumeText) formData.append("resume_text", resumeText);
        if (jdText) formData.append("jd_text", jdText);

        response = await fetch(`${API_BASE_URL}/upload-analyze`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText,
            jobDescription: jdText,
          }),
        });
      }

      const data = (await response.json()) as AnalysisResult;
      setAnalysis(data);
      setStep("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      // Keep UI functional even if backend fails.
      setAnalysis(defaultResult);
      setStep("results");
    } finally {
      try {
        await progressPromise;
      } finally {
        setLoading(false);
      }
    }
  }, [canAnalyze, jdFile, jdText, progressSteps, resumeFile, resumeText, runProgressStaging]);

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

  // Ensure we stop staging when leaving analyzing.
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

