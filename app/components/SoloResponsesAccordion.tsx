'use client';

import { useState } from 'react';

interface SoloBenchmark {
  model: string;
  score: number;
  responseSnippet?: string;
}

interface SoloResponsesAccordionProps {
  research: string;
  analysis: string;
  synthesis: string;
  critique: string;
  soloBenchmarks: SoloBenchmark[];
  showScores?: boolean;
}

const SECTIONS: { key: keyof Pick<SoloResponsesAccordionProps, 'research' | 'analysis' | 'synthesis' | 'critique'>; label: string; modelName: string }[] = [
  { key: 'research', label: 'Research', modelName: 'Perplexity' },
  { key: 'analysis', label: 'Analysis', modelName: 'Claude' },
  { key: 'synthesis', label: 'Synthesis', modelName: 'GPT-4' },
  { key: 'critique', label: 'Critique', modelName: 'Grok' },
];

export function SoloResponsesAccordion({
  research,
  analysis,
  synthesis,
  critique,
  soloBenchmarks,
  showScores = true,
}: SoloResponsesAccordionProps) {
  const [mainOpen, setMainOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const data = { research, analysis, synthesis, critique };
  const byModel = Object.fromEntries(soloBenchmarks.map((b) => [b.model, b]));

  const modelColors: Record<string, string> = {
    Perplexity: '#3b82f6',
    Claude: '#d97706',
    'GPT-4': '#10b981',
    Grok: '#6366f1',
  };

  return (
    <section className="mb-8">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono mb-3">
        SEE HOW EACH AI ANSWERED
      </h3>
      <div className="space-y-1">
      <button
        type="button"
        onClick={() => setMainOpen(!mainOpen)}
        className="text-left w-full flex items-center justify-between rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] px-5 py-3.5 text-gray-300 font-medium hover:bg-[#111] transition-colors"
      >
        View Individual Model Responses
        <span className="text-gray-500 text-base transition-transform" style={{ transform: mainOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>
      {mainOpen && (
        <div className="space-y-1 mt-1">
          {SECTIONS.map(({ key, label, modelName }) => {
            const content = data[key];
            const score = byModel[modelName]?.score ?? null;
            const isExpanded = expandedKey === key;
            const color = modelColors[modelName] ?? '#6b7280';
            return (
              <div key={key} className="rounded-xl border border-[#1a1a1a] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedKey(isExpanded ? null : key)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left text-gray-300 hover:bg-[#111] transition-colors bg-[#0c0c0c]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-xs font-mono" style={{ color }}>{modelName}</span>
                    {showScores && score != null && <span className="text-xs text-gray-600">{score}%</span>}
                  </div>
                  <span className="text-gray-600 text-base transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                </button>
                {isExpanded && (
                  <div className="px-5 py-4 bg-[#0a0a0a] border-t border-[#1a1a1a] text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {content || 'No response for this model.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>
    </section>
  );
}
