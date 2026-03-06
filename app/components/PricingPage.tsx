'use client';

import { useState } from 'react';

interface PricingPageProps {
  currentTier: string;
  onClose: () => void;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  queries: string;
  models: string;
  features: string[];
  badge?: string;
  foundingBadge?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    queries: '5 queries / month',
    models: '3 models',
    features: ['Claude + GPT-4 + Grok', 'Clean mode only', 'Quick mode only'],
    cta: 'Current Plan',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$29.99',
    period: '/mo',
    queries: '50 queries / month',
    models: '3 models',
    features: ['Claude + GPT-4 + Grok', 'All personality modes', 'Quick + Deep modes'],
    foundingBadge: true,
    cta: 'Upgrade to Basic',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49.99',
    period: '/mo',
    queries: '50 queries / month',
    models: '3 models',
    features: ['Claude + GPT-4 + Grok', 'Deep mode + smart routing', 'Quick + Deep modes', 'All personality modes'],
    badge: 'Most Popular',
    foundingBadge: true,
    cta: 'Upgrade to Pro',
  },
];

export function PricingPage({ currentTier, onClose }: PricingPageProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  async function handleUpgrade(tierId: string) {
    if (tierId === 'free' || tierId === currentTier) return;
    setLoadingTier(tierId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error('Checkout error:', e);
      setLoadingTier(null);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#060606]/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="max-w-[780px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[28px] font-bold text-white tracking-tight mb-2">
              Choose your plan
            </h2>
            <p className="text-[15px] text-gray-500">
              ChatGPT ($20) + Claude ($20) + Grok ($22) ={' '}
              <span className="line-through text-gray-600">$62/mo</span>
              {'. '}
              <span className="text-amber-400 font-semibold">Verdict does it all for $29.99.</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-400 transition-colors text-2xl leading-none mt-1"
            aria-label="Close pricing"
          >
            ×
          </button>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.id === currentTier;
            const isPro = plan.id === 'pro';
            const isFree = plan.id === 'free';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 flex flex-col gap-5 ${
                  isPro
                    ? 'border-amber-500/60 bg-amber-500/5'
                    : isCurrentPlan
                    ? 'border-[#2a2a2a] bg-[#0e0e0e]'
                    : 'border-[#1a1a1a] bg-[#0c0c0c]'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-black bg-amber-500 px-3 py-1 rounded-full tracking-wider whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest font-mono mb-2">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-[13px] text-gray-500">{plan.period}</span>
                    )}
                  </div>
                  {plan.foundingBadge && (
                    <p className="text-[11px] text-amber-500/70 mt-1 font-mono">
                      ★ Founding Member — lock in this rate forever
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[13px] font-semibold text-amber-400">{plan.queries}</p>
                  <p className="text-[12px] text-gray-500">{plan.models}</p>
                </div>

                <ul className="flex flex-col gap-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-gray-400">
                      <span className="text-amber-500 mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrentPlan || isFree || loadingTier !== null}
                  className={`w-full py-3 text-[13px] font-semibold rounded-xl transition-colors ${
                    isCurrentPlan
                      ? 'bg-[#1a1a1a] text-gray-600 cursor-default'
                      : isFree
                      ? 'bg-[#1a1a1a] text-gray-600 cursor-default'
                      : isPro
                      ? 'bg-amber-500 hover:bg-amber-400 text-black disabled:opacity-60'
                      : 'bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#2a2a2a] disabled:opacity-60'
                  }`}
                >
                  {loadingTier === plan.id ? 'Redirecting...' : isCurrentPlan ? 'Current Plan' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-700 mt-8">
          Cancel anytime. Subscriptions managed via Stripe. Query limits reset monthly.
        </p>
      </div>
    </div>
  );
}
