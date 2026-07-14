import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Brain,
  Download,
  RefreshCw,
  ChevronRight,
  BarChart2,
  BookOpen,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { scoreColor } from "../utils/helpers";
import { OverviewTab } from "./OverviewTab";
import { SkillsTab } from "./SkillsTab";
import { KeywordsTab } from "./KeywordsTab";
import { SectionsTab } from "./SectionsTab";
import { AISuggestionsTab } from "./AISuggestionsTab";
import { RoadmapTab } from "./RoadmapTab";
import type { AnalysisResult } from "../../hooks/useResumeAnalyzer";

type TabId = "overview" | "skills" | "keywords" | "sections" | "ai" | "roadmap";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "keywords", label: "Keywords", icon: Target },
  { id: "sections", label: "Sections", icon: BookOpen },
  { id: "ai", label: "AI Suggestions", icon: Sparkles },
  { id: "roadmap", label: "Roadmap", icon: TrendingUp },
];

export function ResultsView({
  analysis,
  progress: _progress,
  onReset,
  onDownload,
}: {
  analysis: AnalysisResult | null;
  progress: { index: number; message: string; percent: number; steps: { title: string; detail: string }[] };
  onReset: () => void;
  onDownload: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [expandedAI, setExpandedAI] = useState<number | null>(0);

  const safe = analysis;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      <header
        className="px-6 py-3.5 border-b border-border flex items-center gap-3 sticky top-0 z-20"
        style={{ background: "var(--background)" }}
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <Brain size={15} className="text-indigo-400" />
          <span
            className="font-bold text-sm"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            ResumeAI
          </span>
        </div>
        <span className="text-border hidden sm:block">|</span>
        <div className="hidden sm:flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">Resume</span>
          <ChevronRight size={12} className="text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground truncate">Job Description</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{
              borderColor: scoreColor(safe?.atsScore ?? 0) + "40",
              background: scoreColor(safe?.atsScore ?? 0) + "14",
            }}
          >
            <span
              className="text-xs font-bold"
              style={{
                color: scoreColor(safe?.atsScore ?? 0),
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {safe?.atsScore ?? 0} / 100
            </span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
          >
            <RefreshCw size={11} />
            <span className="hidden sm:block">New Analysis</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-400 transition-colors"
          >
            <Download size={11} />
            <span className="hidden sm:block">Report</span>
          </button>
        </div>
      </header>

      <div
        className="border-b border-border sticky top-[57px] z-10"
        style={{ background: "var(--background)" }}
      >
        <div className="px-4 flex overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150
                  ${
                    active
                      ? "border-indigo-400 text-indigo-400"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-7 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "overview" && <OverviewTab analysis={safe} />}
            {activeTab === "skills" && <SkillsTab analysis={safe} />}
            {activeTab === "keywords" && <KeywordsTab analysis={safe} />}
            {activeTab === "sections" && <SectionsTab analysis={safe} />}
            {activeTab === "ai" && (
              <AISuggestionsTab
                analysis={safe}
                expandedAI={expandedAI}
                setExpandedAI={setExpandedAI}
              />
            )}
            {activeTab === "roadmap" && <RoadmapTab analysis={safe} />}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

