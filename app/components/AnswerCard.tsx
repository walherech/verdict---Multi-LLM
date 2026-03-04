'use client';

import { MarkdownBlock } from './MarkdownBlock';
import { ScoreBadge } from './ScoreBadge';

interface AnswerCardProps {
  solution: string;
  engineScore?: number;
  showScores: boolean;
  meta?: { mode?: string; totalModelsRun?: number }; 
  solveTime?: number;
}

export function AnswerCard({ solution, engineScore, showScores, meta, solveTime }: AnswerCardProps) {
  const modeLabel = meta?.mode === 'quick' ? 'Quick' : 'Deep';
  const modelCount = meta?.totalModelsRun ?? 0;
  const timeStr = solveTime != null ? `${solveTime}s` : '—';
  return (
    <section className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl p-7 pb-6 mb-6">
      <div className="flex justify-between items-start gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-amber-500">⚡ COMBINED ANSWER</span>
          </div>
          <span className="text-xs text-gray-600">
            Synthesized from {modelCount} model{modelCount !== 1 ? 's' : ''} • {modeLabel} mode • {timeStr}
          </span>
        </div>
        {showScores && engineScore != null && (
          <ScoreBadge score={engineScore} size="lg" />
        )}
      </div>
      <div className="text-[15px] text-gray-300 leading-relaxed">
        <MarkdownBlock content={solution || 'No answer generated.'} />
      </div>
    </section>
  );
}
