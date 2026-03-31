import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../generated/prisma/browser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  if (!signature) return res.status(400).send("Missing stripe-signature");

  if (!Buffer.isBuffer(req.body)) return res.status(400).send("Raw body required");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Stripe event received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Convert metadata to string just in case
    const paymentId = session.metadata?.paymentId?.toString();
    const bookingId = session.metadata?.bookingId?.toString();

    console.log("📦 Metadata — paymentId:", paymentId, "bookingId:", bookingId);

    if (!paymentId || !bookingId) {
      console.error("❌ Missing metadata in Stripe session");
      return res.status(400).send("Missing metadata");
    }

    // ✅ Update payment & booking in DB
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.PAID, transactionId: String(session.payment_intent) },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: PaymentStatus.PAID },
    });

    console.log("✅ Payment and booking updated to PAID");
  }

  return res.status(200).json({ received: true });
};