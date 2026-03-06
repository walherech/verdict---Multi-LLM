import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const TIER_PRICE_MAP: Record<string, string> = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  pro: process.env.STRIPE_PRICE_PRO!,
};

export const PRICE_TIER_MAP: Record<string, { tier: string; queries_limit: number }> = {
  [process.env.STRIPE_PRICE_BASIC!]: { tier: 'basic', queries_limit: 50 },
  [process.env.STRIPE_PRICE_PRO!]: { tier: 'pro', queries_limit: 50 },
};
