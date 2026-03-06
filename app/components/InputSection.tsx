'use client';

import { useState } from 'react';

export type ResponseMode = 'quick' | 'deep';
export type Personality = 'savage' | 'cocky' | 'clean';

interface InputSectionProps {
  value?: string;
  onChange?: (v: string) => void;
  mode: ResponseMode;
  onModeChange: (m: ResponseMode) => void;
  personality: Personality;
  onPersonalityChange: (p: Personality) => void;
  showScores: boolean;
  onShowScoresChange: (v: boolean) => void;
  onSubmit?: () => void;
  loading?: boolean;
  /** When true, only render the controls row (mode, personality, scores). */
  controlsOnly?: boolean;
  /** Current user tier for gating locked controls. */
  tier?: string;
  /** Called when user clicks a locked control. */
  onUpgradeClick?: () => void;
}

export function InputSection({
  value = '',
  onChange,
  mode,
  onModeChange,
  personality,
  onPersonalityChange,
  showScores,
  onShowScoresChange,
  onSubmit,
  loading = false,
  controlsOnly = false,
  tier = 'free',
  onUpgradeClick,
}: InputSectionProps) {
  const [lockedHint, setLockedHint] = useState<string | null>(null);

  const deepLocked = tier === 'free' || tier === 'basic';
  const personalityLocked = tier === 'free';

  function handleLockedClick(hint: string) {
    setLockedHint(hint);
    setTimeout(() => setLockedHint(null), 2500);
    onUpgradeClick?.();
  }

  const controlsRow = (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Mode toggle */}
        <div className="flex rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-0.5">
          <button
            type="button"
            onClick={() => onModeChange('quick')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide font-mono transition-colors ${
              mode === 'quick'
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-500'
                : 'bg-[#0f0f0f] border border-[#1a1a1a] text-gray-500 hover:text-gray-400'
            }`}
          >
            ⚡ Quick
          </button>
          <button
            type="button"
            onClick={
              deepLocked
                ? () => handleLockedClick('Deep mode requires Pro or Max')
                : () => onModeChange('deep')
            }
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide font-mono transition-colors ${
              mode === 'deep' && !deepLocked
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-500'
                : deepLocked
                ? 'bg-[#0f0f0f] border border-[#1a1a1a] text-gray-600 cursor-pointer'
                : 'bg-[#0f0f0f] border border-[#1a1a1a] text-gray-500 hover:text-gray-400'
            }`}
          >
            {deepLocked ? '🔒' : '🔬'} Deep
          </button>
        </div>

        {/* Personality toggle */}
        <div className="flex rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-0.5">
          {[
            { key: 'savage' as const, icon: '🔥', label: 'Savage', locked: personalityLocked },
            { key: 'cocky' as const, icon: '😏', label: 'Cocky', locked: personalityLocked },
            { key: 'clean' as const, icon: '🎯', label: 'Clean', locked: false },
          ].map(({ key, icon, label, locked }) => (
            <button
              key={key}
              type="button"
              onClick={
                locked
                  ? () => handleLockedClick('Personality modes require a paid plan')
                  : () => onPersonalityChange(key)
              }
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                personality === key && !locked
                  ? 'bg-white/5 border border-[#333] text-white'
                  : locked
                  ? 'border border-[#1a1a1a] text-gray-600 cursor-pointer'
                  : 'border border-[#1a1a1a] text-gray-500 hover:text-gray-400'
              }`}
            >
              {locked ? '🔒' : icon} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Scores</span>
        <button
          type="button"
          role="switch"
          aria-checked={showScores}
          onClick={() => onShowScoresChange(!showScores)}
          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-[#2a2a2a] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
            showScores ? 'bg-amber-500' : 'bg-[#2a2a2a]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition ${
              showScores ? 'translate-x-5' : 'translate-x-0.5'
            }`}
            style={{ marginTop: 2 }}
          />
        </button>
      </div>

      {/* Inline upgrade hint */}
      {lockedHint && (
        <p className="w-full text-[12px] text-amber-500/80 font-mono">
          🔒 {lockedHint} — <button type="button" onClick={onUpgradeClick} className="underline">Upgrade</button>
        </p>
      )}
    </div>
  );

  if (controlsOnly) return controlsRow;

  return (
    <section className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Strategy, research, tax questions, business decisions..."
        className="w-full min-h-[160px] bg-[#0c0c0c] border border-[#1a1a1a] rounded-[14px] px-5 py-4 text-[16px] text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/40 transition-colors resize-y"
        disabled={loading}
      />
      {controlsRow}
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="w-full mt-5 py-4 text-[15px] font-semibold bg-amber-500 hover:bg-amber-400 disabled:bg-[#1a1a1a] disabled:text-gray-600 disabled:cursor-not-allowed text-black rounded-xl transition-colors"
      >
        Solve It
      </button>
    </section>
  );
}
