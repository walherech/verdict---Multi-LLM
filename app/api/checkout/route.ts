import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getStripe, TIER_PRICE_MAP } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier } = await req.json();
  const priceId = TIER_PRICE_MAP[tier];

  if (!priceId) {
    return NextResponse.json({ error: `Unknown tier: ${tier}` }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL!;

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/?checkout=success`,
    cancel_url: `${baseUrl}/?checkout=cancel`,
    metadata: {
      user_email: session.user.email,
      tier,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
