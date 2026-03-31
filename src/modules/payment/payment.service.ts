import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../generated/prisma/browser";
import { PaymentMethod } from "./payment.interface";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const createPayment = async (
  customerId: string,
  bookingId: string,
  method: PaymentMethod
) => {
  // Find booking and validate
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    include: { service: true, payment: true },
  });
  console.log("📌 Booking found:", booking?.id);
  console.log("📌 Existing payment:", booking?.payment);
  if (!booking) throw new Error("Booking not found");
  if (booking.payment) throw new Error("Payment already exists for this booking");
  if (booking.bookingStatus === "CANCELLED") throw new Error("Cannot pay for a cancelled booking");

  // ── CASH ON DELIVERY ──────────────────────────────────────────
  if (method === "CASH_ON_DELIVERY") {
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.service.price,
        method: "CASH_ON_DELIVERY",
        status: PaymentStatus.PENDING,
      },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: PaymentStatus.PENDING },
    });

    return payment;
  }

  // ── STRIPE ────────────────────────────────────────────────────
  // Create pending payment record first to get paymentId for metadata
  const payment = await prisma.payment.create({
    data: {
      bookingId,
      amount: booking.service.price,
      method: "STRIPE",
      status: PaymentStatus.PENDING,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking.id}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?bookingId=${booking.id}`,
    metadata: {
      bookingId: booking.id,
      paymentId: payment.id, // ← used in webhook to update the correct record
      customerId,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(booking.service.price) * 100), // Stripe uses cents
          product_data: {
            name: booking.service.title,
          },
        },
      },
    ],
  });

  return {
    payment,
    url: session.url,       // redirect user to this URL to complete payment
    sessionId: session.id,
  };
};

const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: { booking: { customerId } },
    include: {
      booking: {
        include: { service: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentById = async (customerId: string, paymentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      booking: { customerId },
    },
    include: {
      booking: {
        include: { service: true },
      },
    },
  });

  if (!payment) throw new Error("Payment not found");
  return payment;
};

export const PaymentService = { createPayment, getMyPayments, getPaymentById };