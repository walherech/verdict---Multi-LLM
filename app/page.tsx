'use client';

import { useState } from 'react';
import { GateScreen } from '@/app/components/GateScreen';
import { InputSection, type ResponseMode, type Personality } from '@/app/components/InputSection';
import { LoadingSection } from '@/app/components/LoadingSection';
import { AnswerCard } from '@/app/components/AnswerCard';
import { Scoreboard } from '@/app/components/Scoreboard';
import { RoastsSection } from '@/app/components/RoastsSection';
import { SoloResponsesAccordion } from '@/app/components/SoloResponsesAccordion';
import { Footer } from '@/app/components/Footer';

const PRODUCT_NAME = 'VERDICT';

interface ApiResult {
  solution: string;
  research: string;
  analysis: string;
  synthesis: string;
  critique: string;
  solveTime: number;
  iterations: number;
  quality: string;
  modelsUsed: string[];
  chainLog: { modelName: string; role: string; snippet: string; scoreAfter: number }[];
  meta: {
    engineScore: number;
    soloBenchmarks: { model: string; score: number; responseSnippet?: string }[];
    timing: { totalMs: number; parallelMs?: number; synthesisMs?: number };
    mode: ResponseMode;
    showScores: boolean;
    commentary: { model: string; score: number; roast: string }[];
    engineCommentary: string;
    soloCommentary: { model: string; score: number | null; roast: string }[];
    disclaimer: string;
    personality: string;
  };
}

export default function HomePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ResponseMode>('deep');
  const [personality, setPersonality] = useState<Personality>('savage');
  const [showScores, setShowScores] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const problem = input.trim();
    if (!problem || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    setLoadingStartTime(Date.now());
    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem,
          personality,
          mode,
          showScores,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Request failed');
        return;
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setLoadingStartTime(null);
    }
  }

  const meta = result?.meta;
  const showScoresFromApi = meta?.showScores ?? showScores;

  if (!authenticated) {
    return <GateScreen onEnter={() => setAuthenticated(true)} productName={PRODUCT_NAME} />;
  }

  return (
    <main className="min-h-screen bg-[#060606] text-gray-200">
      <header className="py-5 px-8 flex justify-between items-center border-b border-[#111]">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">⚡</span>
          <span className="text-[17px] font-bold text-white tracking-tight">{PRODUCT_NAME}</span>
          <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded-full tracking-wider">
            BETA
          </span>
        </div>
        <div className="flex items-center gap-4 text-[13px] text-gray-500">
          <span className="font-mono text-xs">8 / 50 queries</span>
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-[13px] font-semibold text-amber-500">
            S
          </div>
        </div>
      </header>

      <div className="max-w-[800px] mx-auto px-6 py-12">
        {!result && (
          <div>
            {!loading && (
              <div className="text-center mb-10">
                <h2 className="text-[28px] font-bold text-white tracking-tight mb-2.5">
                  Ask anything.
                </h2>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  We run it through Claude, GPT-4, and Grok simultaneously.
                  <br />
                  Then combine the best parts into one answer.
                </p>
              </div>
            )}

            {!loading && (
              <>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Strategy, research, tax questions, business decisions..."
                  rows={4}
                  className="w-full py-4 px-5 text-[15px] bg-[#0c0c0c] border border-[#1a1a1a] rounded-[14px] text-white outline-none resize-y leading-relaxed focus:border-amber-500/40 transition-colors"
                />
                <div className="mt-4">
                  <InputSection
                    mode={mode}
                    onModeChange={setMode}
                    personality={personality}
                    onPersonalityChange={setPersonality}
                    showScores={showScores}
                    onShowScoresChange={setShowScores}
                    controlsOnly
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!input.trim() || loading}
                  className="w-full mt-5 py-4 text-[15px] font-semibold bg-amber-500 hover:bg-amber-400 disabled:bg-[#1a1a1a] disabled:text-gray-600 disabled:cursor-not-allowed text-black rounded-xl transition-colors"
                >
                  Solve It
                </button>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <LoadingSection startTime={loadingStartTime} />
        )}

        {!loading && result && (
          <div className="animate-in fade-in duration-500">
            <AnswerCard
              solution={result.solution}
              engineScore={meta?.engineScore}
              showScores={showScoresFromApi}
              meta={{ mode: meta?.mode, totalModelsRun: (meta as any)?.totalModelsRun }}
              solveTime={result.solveTime}
            />

            {showScoresFromApi && meta && (
              <>
                <Scoreboard
                  soloBenchmarks={meta.soloBenchmarks}
                  engineScore={meta.engineScore}
                />
                <RoastsSection
                  soloCommentary={meta.soloCommentary}
                  engineCommentary={meta.engineCommentary ?? ''}
                  disclaimer={meta.disclaimer ?? ''}
                  showScores={showScoresFromApi}
                />
              </>
            )}

            <SoloResponsesAccordion
              research={result.research ?? ''}
              analysis={result.analysis ?? ''}
              synthesis={result.synthesis ?? ''}
              critique={result.critique ?? ''}
              soloBenchmarks={meta?.soloBenchmarks ?? []}
              showScores={showScoresFromApi}
            />

            <button
              type="button"
              onClick={() => { setResult(null); setInput(''); setError(null); }}
              className="w-full mt-6 py-4 text-[15px] font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-colors"
            >
              Ask Another Question
            </button>

            <Footer />
          </div>
        )}

        {!result && !loading && <Footer />}
      </div>
    </main>
  );
}
