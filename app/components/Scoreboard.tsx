'use client';

import { ScoreBadge } from './ScoreBadge';

interface SoloBenchmark {
  model: string;
  score: number;
  responseSnippet?: string;
}

interface ScoreboardProps {
  soloBenchmarks: SoloBenchmark[];
  engineScore: number;
  engineModelLabel?: string;
}

function modelColor(score: number | null): string {
  if (score === null) return '#4b5563';
  if (score >= 90) return '#22c55e';
  if (score >= 75) return '#f59e0b';
  return '#6366f1';
}

export function Scoreboard({ soloBenchmarks, engineScore, engineModelLabel = 'Verdict' }: ScoreboardProps) {
  const models = soloBenchmarks.filter((b) => b.score != null);

  return (
    <section className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono mb-3">
        SCOREBOARD
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#0c0c0c] border border-amber-500/30 rounded-xl p-4 text-center">
          <div className="flex justify-center">
            <ScoreBadge score={engineScore} size="md" />
          </div>
          <p className="text-xs font-semibold text-amber-500 mt-2 font-mono">{engineModelLabel}</p>
        </div>
        {models.map((b) => {
          const color = modelColor(b.score);
          return (
            <div
              key={b.model}
              className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl p-4 text-center"
            >
              <div className="flex justify-center">
                <ScoreBadge score={b.score} size="md" />
              </div>
              <p className="text-xs font-semibold mt-2 font-mono" style={{ color }}>
                {b.model}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
