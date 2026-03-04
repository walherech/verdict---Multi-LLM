'use client';

type Size = 'sm' | 'md' | 'lg';

interface ScoreBadgeProps {
  score: number;
  size?: Size;
}

const sizes: Record<Size, { w: string; h: string; font: string; label: string }> = {
  sm: { w: 'w-9', h: 'h-9', font: 'text-[11px]', label: 'text-[8px]' },
  md: { w: 'w-[52px]', h: 'h-[52px]', font: 'text-[15px]', label: 'text-[9px]' },
  lg: { w: 'w-[72px]', h: 'h-[72px]', font: 'text-[22px]', label: 'text-[10px]' },
};

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const color = score >= 90 ? '#22c55e' : score >= 75 ? '#f59e0b' : '#ef4444';
  const s = sizes[size];
  return (
    <div
      className={`${s.w} ${s.h} rounded-full flex flex-col items-center justify-center border-2`}
      style={{
        borderColor: color,
        background: `${color}10`,
      }}
    >
      <span className={`${s.font} font-bold leading-none`} style={{ color }}>
        {score}
      </span>
      {size !== 'sm' && (
        <span className={`${s.label} text-gray-500 mt-0.5`}>/ 100</span>
      )}
    </div>
  );
}
