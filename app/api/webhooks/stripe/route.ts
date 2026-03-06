import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICE_TIER_MAP } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

// Required for raw body access in Next.js App Router
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    console.error('[stripe/webhook] Signature error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.metadata?.user_email ?? session.customer_email;

    if (!email) {
      console.error('[stripe/webhook] No email on checkout.session.completed');
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Resolve the price ID from the line items
    const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, { limit: 1 });
    const priceId = lineItems.data[0]?.price?.id;
    const tierInfo = priceId ? PRICE_TIER_MAP[priceId] : null;

    if (!tierInfo) {
      console.error('[stripe/webhook] Unknown price ID:', priceId);
      return NextResponse.json({ error: 'Unknown price' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        tier: tierInfo.tier,
        queries_limit: tierInfo.queries_limit,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (error) {
      console.error('[stripe/webhook] Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Look up user by Stripe customer ID
    const { data: user, error: lookupError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('stripe_customer_id', customerId)
      .single();

    if (lookupError || !user) {
      console.error('[stripe/webhook] Could not find user for customer:', customerId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        tier: 'free',
        queries_limit: 5,
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('email', user.email);

    if (error) {
      console.error('[stripe/webhook] Supabase reset error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
