export const DATA = {
  candidate: {
    name: "Sarah Chen",
    email: "sarah.chen@dev.io",
    phone: "+1 (415) 555-0192",
  },
  jobTitle: "Senior ML Engineer",
  company: "NovaTech AI",
  atsScore: 85,
  subscores: [
    { label: "Keyword Match", value: 92 },
    { label: "Skill Match", value: 80 },
    { label: "Experience Match", value: 75 },
    { label: "Education Match", value: 100 },
    { label: "Formatting", value: 95 },
    { label: "Readability", value: 90 },
  ],
  matchedSkills: [
    "Python",
    "SQL",
    "Machine Learning",
    "TensorFlow",
    "Git",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Data Analysis",
    "Deep Learning",
  ],
  missingSkills: [
    "Docker",
    "AWS",
    "Kubernetes",
    "CI/CD",
    "FastAPI",
    "MLflow",
    "Apache Spark",
  ],
  keywordsPresent: [
    "Machine Learning",
    "Python",
    "Classification",
    "TensorFlow",
    "Neural Networks",
    "Data Pipeline",
    "Feature Engineering",
    "Model Training",
  ],
  keywordsMissing: [
    "Deployment",
    "Cloud Infrastructure",
    "MLOps",
    "REST API",
    "Docker",
    "Production Systems",
    "A/B Testing",
    "Optimization",
  ],
  sections: [
    { name: "Contact Information", present: true },
    { name: "Professional Summary", present: true },
    { name: "Work Experience", present: true },
    { name: "Projects", present: true },
    { name: "Education", present: true },
    { name: "Technical Skills", present: true },
    { name: "Certifications", present: false },
    { name: "Achievements & Awards", present: false },
    { name: "Publications / Research", present: false },
  ],
  formattingIssues: [
    {
      ok: false,
      text: "Profile photo detected — images cannot be parsed by ATS systems",
    },
    {
      ok: false,
      text: "Multi-column layout detected — may cause content parsing errors",
    },
    { ok: true, text: "No tables detected" },
    { ok: true, text: "Standard fonts used throughout" },
    { ok: true, text: "Consistent heading hierarchy (H1 → H3)" },
    { ok: true, text: "Appropriate margins and white space" },
    {
      ok: true,
      text: "Bullet points used consistently in experience section",
    },
  ],
  strengths: [
    "Strong technical skills section with 10+ relevant technologies",
    "Diverse ML project portfolio with 4 distinct projects",
    "Relevant academic background — M.S. Computer Science",
    "Consistent bullet-point formatting and clear visual hierarchy",
    "Quantifiable achievements present in 2 of 3 experience entries",
  ],
  weaknesses: [
    "2 of 4 projects lack measurable impact or outcome metrics",
    "No professional certifications (AWS, GCP, or TensorFlow DevCert)",
    "Some experience descriptions use passive language without action verbs",
    "GitHub profile URL absent from contact section",
    "LinkedIn URL not included — recruiters actively cross-reference it",
    "No portfolio or personal website linked",
  ],
  sectionScores: [
    { name: "Education", score: 95 },
    { name: "Formatting", score: 92 },
    { name: "Skills", score: 90 },
    { name: "Projects", score: 80 },
    { name: "Experience", score: 72 },
    { name: "Summary", score: 70 },
    { name: "Achievements", score: 65 },
  ],
  aiSuggestions: [
    {
      section: "Experience — ML Engineer @ DataVerse Inc.",
      before: "Worked on machine learning project for customer churn prediction.",
      after:
        "Developed a Random Forest classifier achieving 94% accuracy on customer churn prediction across a 150K+ customer dataset using Scikit-learn and Pandas, contributing to a 12% reduction in quarterly churn rate.",
    },
    {
      section: "Projects — Customer Support Bot",
      before: "Built a chatbot for customer support.",
      after:
        "Designed and deployed an AI-powered customer support chatbot using LangChain and the Gemini API, handling 2,000+ daily queries and reducing average first-response latency by ~40%.",
    },
    {
      section: "Experience — Data Engineer @ Nexus Analytics",
      before: "Helped improve data pipeline performance.",
      after:
        "Optimized ETL pipeline with Apache Spark and Airflow, cutting daily processing time by 65% (4 hrs → 84 min) across a 500 GB ingestion workflow spanning 12 upstream data sources.",
    },
  ],
  roadmap: {
    high: [
      {
        task: "Learn Docker & container orchestration",
        detail: "Missing critical deployment skill listed in target JD",
      },
      {
        task: "Add a FastAPI project to your portfolio",
        detail: "FastAPI is explicitly required in the job description",
      },
      {
        task: "Quantify all project outcomes with impact metrics",
        detail:
          "Numbers increase both ATS match rate and recruiter attention",
      },
      {
        task: "Rewrite professional summary with JD keywords",
        detail: "Current summary scores 70 / 100 — below the 80 threshold",
      },
    ],
    medium: [
      {
        task: "Earn AWS Cloud Practitioner certification",
        detail: "Cloud experience listed as a preferred qualification",
      },
      {
        task: "Add a public GitHub profile link",
        detail: "Expected at senior level; currently absent from resume",
      },
      {
        task: "Learn Kubernetes fundamentals",
        detail:
          "Frequently required in senior ML engineer job descriptions",
      },
    ],
    low: [
      {
        task: "Build a portfolio website with project demos",
        detail:
          "Low ATS uplift but a strong signal for senior hiring managers",
      },
      {
        task: "Optimize your LinkedIn headline and summary",
        detail:
          "Recruiters heavily cross-reference LinkedIn at senior level",
      },
    ],
  },
};
