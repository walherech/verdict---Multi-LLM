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
      <div className="flex flex-col gap-2">
        {soloCommentary.map((c) => (
          <div
            key={c.model}
            className={`rounded-xl border p-4 flex gap-4 items-start ${
              c.score === null
                ? 'bg-[#0a0a0a] border-dashed border-[#1a1a1a]'
                : 'bg-[#0c0c0c] border-[#1a1a1a]'
            }`}
          >
            <div className="min-w-[56px] text-center">
              <span
                className="text-[11px] font-bold font-mono"
                style={{ color: modelColor(c.score) }}
              >
                {c.model}
              </span>
              {showScores && c.score != null && (
                <div className="mt-1 flex justify-center">
                  <ScoreBadge score={c.score} size="sm" />
                </div>
              )}
              {showScores && c.score === null && (
                <div className="text-[9px] text-gray-600 font-mono mt-1">DNP</div>
              )}
            </div>
            <p className={`text-sm text-gray-400 leading-relaxed mt-0 italic ${c.score === null ? 'text-gray-600' : ''}`}>
              &quot;{c.roast || '—'}&quot;
            </p>
          </div>
        ))}
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
