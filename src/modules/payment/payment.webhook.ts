import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../generated/prisma/browser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,  // must be raw
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.paymentId;
    const bookingId = session.metadata?.bookingId;

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.PAID, transactionId: String(session.payment_intent) },
      });
    }

    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: PaymentStatus.PAID },
      });
    }
  }

  res.status(200).json({ received: true });
};

export const PaymentController = {
  stripeWebhook,
};

