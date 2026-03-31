// src/modules/payment/payment.webhook.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../generated/prisma/browser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return res.status(400).send("Booking ID not found in metadata");
    }

    // ✅ Update payment and booking
    await prisma.payment.updateMany({
      where: { bookingId },
      data: { status: PaymentStatus.PAID },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: PaymentStatus.PAID },
    });

    console.log(`Payment for booking ${bookingId} completed.`);
  }

  res.status(200).json({ received: true });
};