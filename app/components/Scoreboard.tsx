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
  const allModels = ['Perplexity', 'Claude', 'GPT-4', 'Grok'];
  const byModel = Object.fromEntries(soloBenchmarks.map((b) => [b.model, b]));

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
        {allModels.map((name) => {
          const b = byModel[name];
          const score = b?.score ?? null;
          const color = modelColor(score);
          return (
            <div
              key={name}
              className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl p-4 text-center"
            >
              {score !== null ? (
                <div className="flex justify-center">
                  <ScoreBadge score={score} size="md" />
                </div>
              ) : (
                <div className="flex justify-center items-center h-[52px]">
                  <span className="text-lg font-mono font-bold text-gray-600">--</span>
                </div>
              )}
              <p className="text-xs font-semibold mt-2 font-mono" style={{ color }}>
                {name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
