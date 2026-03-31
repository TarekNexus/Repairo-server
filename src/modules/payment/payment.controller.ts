import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../generated/prisma/browser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const createPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, method } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({
        success: false,
        message: "bookingId and method are required",
      });
    }

    const result = await PaymentService.createPayment(req.user!.id, bookingId, method);

    return res.status(201).json({
      success: true,
      message:
        method === "CASH_ON_DELIVERY"
          ? "Cash on delivery payment created successfully"
          : "Stripe checkout session created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyPayments = async (req: Request, res: Response) => {
  try {
    const payments = await PaymentService.getMyPayments(req.user!.id);
    return res.status(200).json({ success: true, data: payments });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await PaymentService.getPaymentById(req.user!.id, id as string);
    return res.status(200).json({ success: true, data: payment });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).json({ success: false, message: "Missing stripe-signature header" });
  }

  // Safety check — body must be a raw Buffer, not a parsed object
  if (!Buffer.isBuffer(req.body)) {
    console.error("❌ req.body is not a Buffer. Make sure express.json() is NOT applied to this route.");
    return res.status(400).json({
      success: false,
      message: "Webhook Error: Raw body required. Check middleware order in app.ts",
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("❌ Stripe webhook signature verification failed:", error.message);
    return res.status(400).json({ success: false, message: `Webhook Error: ${error.message}` });
  }

  console.log("✅ Stripe webhook event received:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentId = session.metadata?.paymentId;
      const bookingId = session.metadata?.bookingId;

      console.log("📦 Metadata — paymentId:", paymentId, "bookingId:", bookingId);

      if (!paymentId || !bookingId) {
        console.error("❌ Missing metadata in Stripe session");
        return res.status(400).json({ success: false, message: "Missing metadata in session" });
      }

      // Update payment record
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.PAID,
          transactionId: String(session.payment_intent),
        },
      });

      // Update booking payment status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: PaymentStatus.PAID },
      });

      console.log("✅ Payment and booking updated to PAID");
    }
  } catch (error: any) {
    console.error("❌ Database update failed:", error.message);
    // Still return 200 to Stripe so it doesn't keep retrying for DB errors
    return res.status(200).json({ received: true, warning: "DB update failed" });
  }

  return res.status(200).json({ received: true });
};

export const PaymentController = {
  createPayment,
  getMyPayments,
  getPaymentById,
  stripeWebhook,
};