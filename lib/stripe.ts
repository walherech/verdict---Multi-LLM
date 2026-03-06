import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const TIER_PRICE_MAP: Record<string, string> = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  pro: process.env.STRIPE_PRICE_PRO!,
};

export const PRICE_TIER_MAP: Record<string, { tier: string; queries_limit: number }> = {
  [process.env.STRIPE_PRICE_BASIC!]: { tier: 'basic', queries_limit: 50 },
  [process.env.STRIPE_PRICE_PRO!]: { tier: 'pro', queries_limit: 50 },
};
