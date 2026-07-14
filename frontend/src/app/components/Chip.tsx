import { Check, X } from "lucide-react";

export function Chip({
  label,
  type,
}: {
  label: string;
  type: "success" | "error" | "neutral";
}) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    error: "bg-red-400/10 text-red-400 border-red-400/20",
    neutral: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type]}`}
    >
      {type === "success" && <Check size={10} />}
      {type === "error" && <X size={10} />}
      {label}
    </span>
  );
}
