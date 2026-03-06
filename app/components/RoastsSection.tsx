'use client';

import { ScoreBadge } from './ScoreBadge';

interface CommentaryEntry {
  model: string;
  score: number | null;
  roast: string;
}

interface RoastsSectionProps {
  soloCommentary: CommentaryEntry[];
  engineCommentary: string;
  disclaimer: string;
  showScores?: boolean;
}

function modelColor(score: number | null): string {
  if (score === null) return '#374151';
  if (score >= 90) return '#22c55e';
  if (score >= 75) return '#f59e0b';
  return '#6366f1';
}

export function RoastsSection({ soloCommentary, engineCommentary, disclaimer, showScores = true }: RoastsSectionProps) {
  return (
    <section className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono mb-3">
        ROASTS & COMMENTARY 🔥
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        {soloCommentary.filter((c) => c.score != null && c.roast).map((c) => (
          <div
            key={c.model}
            className="rounded-xl border bg-[#0c0c0c] border-[#1a1a1a] p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-[11px] font-bold font-mono"
                style={{ color: modelColor(c.score) }}
              >
                {c.model}
              </span>
              {showScores && c.score != null && (
                <ScoreBadge score={c.score} size="sm" />
              )}
            </div>
            <p className="text-sm leading-relaxed italic text-gray-400">
              &quot;{c.roast}&quot;
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {engineCommentary && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <p className="text-sm font-medium text-amber-400">Verdict</p>
            <p className="mt-1 text-white">{engineCommentary}</p>
          </div>
        )}
        {disclaimer && (
          <p className="text-xs text-gray-600 mt-2">{disclaimer}</p>
        )}
      </div>
    </section>
  );
}
