import { NextResponse } from "next/server";

/**
 * Checkout API route — PLACEHOLDER.
 *
 * This is where the storefront will later create an order and hand off to the
 * WhatsApp payment bot / payment provider. For now it just echoes back a stub
 * so the route exists and the contract is visible.
 *
 * TODO(payments):
 *   1. Validate the cart payload (zod).
 *   2. Verify prices server-side against Firestore (never trust the client).
 *   3. Create a pending order document in Firestore.
 *   4. Return a WhatsApp deep-link / payment URL for the bot to pick up.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { items?: unknown[] } | null;

  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  return NextResponse.json(
    {
      status: "not_implemented",
      message: "Checkout flow is not wired up yet. Coming soon via the WhatsApp payment bot.",
      itemCount: body.items.length,
    },
    { status: 501 },
  );
}
