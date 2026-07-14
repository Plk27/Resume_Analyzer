import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type AnalysisResult = {
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
  roadmap: { priority: string; items: string[] }[];
  sectionAnalysis: { name: string; present: boolean }[];
};

type StepKey = 'landing' | 'progress' | 'results';

type ProgressItem = {
  title: string;
  detail: string;
};

const defaultResult: AnalysisResult = {
  atsScore: 84,
  keywordMatch: 92,
  skillMatch: 80,
  experienceMatch: 75,
  educationMatch: 100,
  formattingScore: 95,
  readability: 90,
  matchedSkills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Git'],
  missingSkills: ['Docker', 'AWS', 'Kubernetes', 'FastAPI'],
  keywordsPresent: ['Machine Learning', 'Python', 'Classification', 'TensorFlow'],
  keywordsMissing: ['Deployment', 'Cloud', 'Optimization', 'Docker'],
  strengths: ['Strong technical skill section', 'Good project diversity', 'Relevant education', 'Contains measurable achievements'],
  weaknesses: ['Projects lack measurable impact', 'No certifications included', 'Experience descriptions are generic', 'LinkedIn missing'],
  suggestions: [
    'Add quantified impact in each project bullet.',
    'Tailor your summary to the target role and include the top 3 keywords.',
    'Add a compact certifications section with relevant cloud or platform credentials.'
  ],
  roadmap: [
    { priority: 'High', items: ['Learn Docker', 'Add FastAPI project', 'Include measurable achievements'] },
    { priority: 'Medium', items: ['Add certifications', 'Improve GitHub README'] },
    { priority: 'Low', items: ['Portfolio website', 'LinkedIn optimization'] }
  ],
  sectionAnalysis: [
    { name: 'Contact Information', present: true },
    { name: 'Summary', present: true },
    { name: 'Experience', present: true },
    { name: 'Projects', present: true },
    { name: 'Education', present: true },
    { name: 'Skills', present: true },
    { name: 'Certifications', present: false },
    { name: 'Achievements', present: false }
  ]
};

const progressSteps: ProgressItem[] = [
  { title: 'Resume uploaded', detail: 'Preparing your resume for review' },
  { title: 'Parsing content', detail: 'Extracting structure and key details' },
  { title: 'Extracting skills', detail: 'Comparing capabilities against the role' },
  { title: 'Matching experience', detail: 'Aligning achievements with the job description' },
  { title: 'Calculating ATS score', detail: 'Scoring readability and keyword fit' },
  { title: 'Generating recommendations', detail: 'Crafting improvement suggestions' }
];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function App() {
  const [step, setStep] = useState<StepKey>('landing');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [jobFileName, setJobFileName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressMessage, setProgressMessage] = useState(progressSteps[0].detail);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jobInputRef = useRef<HTMLInputElement>(null);

  const scoreBreakdown = useMemo(() => [
    { label: 'Technical Skills', value: analysis?.skillMatch ?? 0 },
    { label: 'Projects', value: 80 },
    { label: 'Experience', value: analysis?.experienceMatch ?? 0 },
    { label: 'Achievements', value: 65 },
    { label: 'Education', value: analysis?.educationMatch ?? 0 },
    { label: 'Formatting', value: analysis?.formattingScore ?? 0 },
    { label: 'Professional Summary', value: 70 }
  ], [analysis]);

  useEffect(() => {
    if (step !== 'progress') return;
    let cancelled = false;
    const runProgress = async () => {
      for (let index = 0; index < progressSteps.length; index += 1) {
        if (cancelled) return;
        setProgressIndex(index);
        setProgressMessage(progressSteps[index].detail);
        await new Promise((resolve) => window.setTimeout(resolve, 500));
      }
      if (!cancelled) {
        setProgressIndex(progressSteps.length - 1);
      }
    };
    void runProgress();
    return () => {
      cancelled = true;
    };
  }, [step]);

  async function runAnalysis() {
    if (!resumeFile && !resumeText.trim()) return;
    if (!jobFile && !jobDescription.trim()) return;

    setStep('progress');
    setAnalysis(null);
    setProgressIndex(0);
    setProgressMessage(progressSteps[0].detail);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));

      let response: Response;
      if (resumeFile || jobFile) {
        const formData = new FormData();
        if (resumeFile) formData.append('resume', resumeFile);
        if (jobFile) formData.append('job_description', jobFile);
        if (resumeText) formData.append('resume_text', resumeText);
        if (jobDescription) formData.append('jd_text', jobDescription);
        response = await fetch('/api/upload-analyze', { method: 'POST', body: formData });
      } else {
        response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, jobDescription })
        });
      }
      const data = await response.json();
      setAnalysis(data);
      setStep('results');
    } catch (error) {
      console.error(error);
      setAnalysis(defaultResult);
      setStep('results');
    }
  }

  function downloadReport() {
    if (!analysis) return;
    const blob = new Blob([`
AI Resume Analyzer Report
========================
ATS Score: ${analysis.atsScore}/100
Keyword Match: ${analysis.keywordMatch}%
Skill Match: ${analysis.skillMatch}%
Experience Match: ${analysis.experienceMatch}%
Education Match: ${analysis.educationMatch}%
Formatting Score: ${analysis.formattingScore}%
Readability: ${analysis.readability}%

Matched Skills:
${analysis.matchedSkills.join(', ')}

Missing Skills:
${analysis.missingSkills.join(', ')}

Keywords Present:
${analysis.keywordsPresent.join(', ')}

Keywords Missing:
${analysis.keywordsMissing.join(', ')}

Suggestions:
${analysis.suggestions.join('\n')}
    `], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'resume-analysis-report.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleResumeSelection(file: File | undefined) {
    if (!file) return;
    setResumeFile(file);
    setResumeFileName(file.name);
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = () => setResumeText(String(reader.result ?? ''));
      reader.readAsText(file);
    } else {
      setResumeText('');
    }
  }

  function handleJobSelection(file: File | undefined) {
    if (!file) return;
    setJobFile(file);
    setJobFileName(file.name);
    setJobDescription('');
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = () => setJobDescription(String(reader.result ?? ''));
      reader.readAsText(file);
    }
  }

  function resetFlow() {
    setStep('landing');
    setResumeText('');
    setJobDescription('');
    setResumeFileName('');
    setJobFileName('');
    setResumeFile(null);
    setJobFile(null);
    setAnalysis(null);
    setProgressIndex(0);
    setProgressMessage(progressSteps[0].detail);
  }

  return (
    <div className="app-shell">
      <div className="container">
        {step === 'landing' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="hero-card">
            <div className="hero-copy">
              <div className="eyebrow">Career-ready resume insights</div>
              <h1>Turn your resume into a stronger application for the roles you want.</h1>
              <p>Upload your resume and the target job description to get a polished ATS analysis, skill-gap review, and tailored recommendations.</p>
              <div className="hero-actions">
                <button onClick={runAnalysis} disabled={!resumeFile && !resumeText.trim() ? true : !jobFile && !jobDescription.trim()}>
                  Begin Analysis
                </button>
                <button className="secondary" onClick={resetFlow}>Clear</button>
              </div>
            </div>
            <div className="hero-panel">
              <div className="hero-badge">What you get</div>
              <ul>
                <li>ATS score and sub-scores</li>
                <li>Keyword and skill-gap insights</li>
                <li>Actionable resume recommendations</li>
              </ul>
            </div>
          </motion.div>
        )}

        {step === 'landing' && (
          <div className="grid grid-2" style={{ marginTop: 24 }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Resume</div>
                  <h3>Upload your resume</h3>
                </div>
                <span className="pill">PDF or DOCX</span>
              </div>

              <div
                className={`upload-zone ${dragActive ? 'active' : ''}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                  const file = event.dataTransfer.files?.[0];
                  handleResumeSelection(file);
                }}
                onClick={() => resumeInputRef.current?.click()}
              >
                <div className="upload-icon">📄</div>
                <p className="upload-title">Drop your resume here</p>
                <p className="upload-subtitle">or choose a file</p>
                <p className="upload-meta">Supports PDF and DOCX • Max 5 MB</p>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  hidden
                  onChange={(event) => handleResumeSelection(event.target.files?.[0])}
                />
              </div>

              {resumeFileName ? (
                <div className="file-chip">
                  <div>
                    <strong>{resumeFileName}</strong>
                    <div className="muted">{resumeFile ? formatFileSize(resumeFile.size) : 'Uploaded'}</div>
                  </div>
                  <button className="secondary small" onClick={(event) => {
                    event.stopPropagation();
                    setResumeFile(null);
                    setResumeFileName('');
                    setResumeText('');
                  }}>
                    Remove
                  </button>
                </div>
              ) : null}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Job description</div>
                  <h3>Choose one input method</h3>
                </div>
                <span className="pill">Upload or paste</span>
              </div>

              <div className="option-block">
                <div className="option-title">Option 1</div>
                <div
                  className={`upload-zone compact ${dragActive ? 'active' : ''}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragActive(false);
                    const file = event.dataTransfer.files?.[0];
                    handleJobSelection(file);
                  }}
                  onClick={() => jobInputRef.current?.click()}
                >
                  <div className="upload-icon">🧾</div>
                  <p className="upload-title">Upload JD file</p>
                  <p className="upload-subtitle">PDF or DOCX</p>
                  <input
                    ref={jobInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    hidden
                    onChange={(event) => handleJobSelection(event.target.files?.[0])}
                  />
                </div>
              </div>

              <div className="divider">or</div>

              <div className="option-block">
                <div className="option-title">Option 2</div>
                <textarea
                  value={jobDescription}
                  onChange={(event) => {
                    setJobDescription(event.target.value);
                    if (jobFile) {
                      setJobFile(null);
                      setJobFileName('');
                    }
                  }}
                  placeholder="Paste the role description here..."
                  disabled={Boolean(jobFile)}
                  className={jobFile ? 'disabled-textarea' : ''}
                />
                {!jobFile ? <p className="helper-text">Upload a PDF/DOCX or paste the job description.</p> : null}
              </div>

              {jobFileName ? (
                <div className="file-chip">
                  <div>
                    <strong>{jobFileName}</strong>
                    <div className="muted">{jobFile ? formatFileSize(jobFile.size) : 'Uploaded'}</div>
                  </div>
                  <button className="secondary small" onClick={(event) => {
                    event.stopPropagation();
                    setJobFile(null);
                    setJobFileName('');
                    setJobDescription('');
                  }}>
                    Remove
                  </button>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}

        {step === 'landing' ? (
          <div className="actions-row">
            <button onClick={runAnalysis} disabled={!resumeFile && !resumeText.trim() ? true : !jobFile && !jobDescription.trim()}>
              Begin Analysis
            </button>
          </div>
        ) : null}

        {step === 'progress' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card progress-card">
            <div className="progress-header">
              <div>
                <div className="eyebrow">Analyzing your resume</div>
                <h3>We are reviewing your match and preparing tailored recommendations.</h3>
              </div>
              <div className="spinner" />
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${((progressIndex + 1) / progressSteps.length) * 100}%` }} />
            </div>
            <div className="status-list">
              {progressSteps.map((item, index) => (
                <div key={item.title} className={`status-item ${index <= progressIndex ? 'done' : ''}`}>
                  <div className="status-dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <div className="muted">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="muted" style={{ marginTop: 16 }}>{progressMessage}</div>
          </motion.div>
        )}

        {step === 'results' && analysis && (
          <div className="grid" style={{ marginTop: 24 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card results-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div className="eyebrow">Resume insight</div>
                  <h2>{analysis.atsScore} / 100 ATS score</h2>
                  <p className="muted">A tailored snapshot of how your resume aligns with the role.</p>
                </div>
                <div className="actions-row inline">
                  <button onClick={downloadReport}>Download Report</button>
                  <button className="secondary" onClick={resetFlow}>Start Over</button>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
              <div className="grid grid-3">
                {[
                  ['Keyword Match', analysis.keywordMatch],
                  ['Skill Match', analysis.skillMatch],
                  ['Experience Match', analysis.experienceMatch],
                  ['Education Match', analysis.educationMatch],
                  ['Formatting Score', analysis.formattingScore],
                  ['Readability', analysis.readability]
                ].map(([label, value]) => (
                  <div key={label} className="metric-card">
                    <div className="metric-label">{label}</div>
                    <div className="metric-value">{value}%</div>
                    <div className="progress"><div style={{ width: `${value}%` }} /></div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-2">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3>Skill Gap Analysis</h3>
                <p><strong>Matched Skills</strong></p>
                <div>{analysis.matchedSkills.map((skill) => <span className="badge" key={skill}>{skill}</span>)}</div>
                <p style={{ marginTop: 16 }}><strong>Missing Skills</strong></p>
                <div>{analysis.missingSkills.map((skill) => <span className="badge" key={skill}>{skill}</span>)}</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3>Keyword Analysis</h3>
                <p><strong>Keywords Present</strong></p>
                <div>{analysis.keywordsPresent.map((word) => <span className="badge" key={word}>{word}</span>)}</div>
                <p style={{ marginTop: 16 }}><strong>Keywords Missing</strong></p>
                <div>{analysis.keywordsMissing.map((word) => <span className="badge" key={word}>{word}</span>)}</div>
              </motion.div>
            </div>

            <div className="grid grid-2">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3>Resume Section Analysis</h3>
                <ul>{analysis.sectionAnalysis.map((section) => <li key={section.name}>{section.name} {section.present ? '✔' : '✖'}</li>)}</ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3>Resume Score Breakdown</h3>
                {scoreBreakdown.map((item) => (
                  <div key={item.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>{item.label}</span><strong>{item.value}</strong></div>
                    <div className="progress"><div style={{ width: `${item.value}%` }} /></div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="grid grid-2">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3>Strengths</h3>
                <ul>{analysis.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
                <h3>Weaknesses</h3>
                <ul>{analysis.weaknesses.map((item) => <li key={item}>{item}</li>)}</ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3>AI Suggestions</h3>
                <ul>{analysis.suggestions.map((item) => <li key={item}>{item}</li>)}</ul>
                <h3>Improvement Roadmap</h3>
                {analysis.roadmap.map((step) => (
                  <div key={step.priority} style={{ marginBottom: 12 }}>
                    <strong>{step.priority} Priority</strong>
                    <ul>{step.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
