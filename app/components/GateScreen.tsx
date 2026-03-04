'use client';

import { useState } from 'react';

const ACCESS_CODE = process.env.NEXT_PUBLIC_ACCESS_CODE || 'OPP2026';

interface GateScreenProps {
  onEnter: () => void;
  productName: string;
}

export function GateScreen({ onEnter, productName }: GateScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (code.toLowerCase() === ACCESS_CODE.toLowerCase()) {
      onEnter();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#060606]"
      style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" } as React.CSSProperties}
    >
      <div
        className={`text-center max-w-[440px] px-6 ${shake ? 'animate-[gate-shake_0.5s_ease]' : ''}`}
      >
        {/* Logo mark */}
        <div className="w-16 h-16 mx-auto mb-8 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 flex items-center justify-center text-3xl">
          ⚡
        </div>

        <h1
          className="text-3xl font-extrabold text-white tracking-tight mb-2"
          style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" } as React.CSSProperties}
        >
          {productName}
        </h1>

        <p
          className="text-sm text-gray-500 mb-12 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" } as React.CSSProperties}
        >
          Multiple AIs. One answer. No mercy.
        </p>

        <div className="relative mb-4">
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter access code"
            className={`w-full py-3.5 px-4 text-[15px] bg-[#0f0f0f] border rounded-xl text-white outline-none text-center tracking-[0.15em] transition-colors ${
              error ? 'border-red-500' : 'border-[#1f1f1f]'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" } as React.CSSProperties}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 text-sm font-semibold bg-amber-500 text-black border-none rounded-xl cursor-pointer tracking-wide transition-colors hover:bg-amber-400"
          style={{ fontFamily: "'Inter', sans-serif" } as React.CSSProperties}
        >
          Enter
        </button>

        {error && (
          <p
            className="text-red-500 text-[13px] mt-3"
            style={{ fontFamily: "'Inter', sans-serif" } as React.CSSProperties}
          >
            Invalid code. Check your invite.
          </p>
        )}

        <p
          className="text-xs text-gray-700 mt-12"
          style={{ fontFamily: "'Inter', sans-serif" } as React.CSSProperties}
        >
          Early access — One Percent Playbook community only
        </p>
      </div>
    </div>
  );
}