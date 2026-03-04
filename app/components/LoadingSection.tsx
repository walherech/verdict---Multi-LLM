'use client';

import { useState, useEffect } from 'react';

interface LoadingSectionProps {
  startTime: number | null;
}

const LOADING_MESSAGES = [
  'Routing your question to the right models...',
  'Multiple AIs working on this simultaneously...',
  'Combining the best insights into one answer...',
];

export function LoadingSection({ startTime }: LoadingSectionProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (startTime === null) return;
    const t1 = setTimeout(() => setLoadingStep(1), 2000);
    const t2 = setTimeout(() => setLoadingStep(2), 5000);
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, [startTime]);

  if (startTime === null) return null;

  return (
    <section className="text-center py-20 animate-in fade-in duration-300">
      <div className="inline-flex gap-1.5 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{ background: i <= loadingStep ? '#f59e0b' : '#1f1f1f' }}
          />
        ))}
      </div>
      <p className="text-[15px] text-gray-400 mb-2">
        {LOADING_MESSAGES[loadingStep]}
      </p>
      <span className="text-[13px] text-gray-600 font-mono">{elapsed}s</span>
    </section>
  );
}
