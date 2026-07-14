export const scoreColor = (v: number) =>
  v >= 80 ? "#34d399" : v >= 60 ? "#fbbf24" : "#f87171";

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
