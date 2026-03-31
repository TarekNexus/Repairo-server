import Stripe from "stripe";
import { PaymentStatus } from "../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const createPayment = async (
  customerId: string,
  bookingId: string,
  method: "CASH_ON_DELIVERY" | "STRIPE"
) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    include: { service: true, payment: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.payment) throw new Error("Payment already exists");
  if (booking.bookingStatus === "CANCELLED")
    throw new Error("Cannot pay for cancelled booking");

  if (method === "CASH_ON_DELIVERY") {
    // ✅ Create a PENDING payment for COD
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.service.price,
        method,
        status: PaymentStatus.PENDING,
      },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: PaymentStatus.PENDING },
    });

    return payment;
  } else if (method === "STRIPE") {
    // ✅ Pre-create a PENDING payment for Stripe
    await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.service.price,
        method,
        status: PaymentStatus.PENDING,
      },
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: { bookingId: booking.id }, // crucial for webhook
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(booking.service.price * 100),
            product_data: { name: booking.service.title },
          },
        },
      ],
    });

    return { url: session.url };
  }
};

const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: { booking: { customerId } },
    include: {
      booking: { include: { service: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentById = async (
  customerId: string,
  paymentId: string
) => {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, booking: { customerId } },
    include: { booking: { include: { service: true } } },
  });

  if (!payment) throw new Error("Payment not found");
  return payment;
};

const createStripeCheckoutSession = async (
  customerId: string,
  bookingId: string
) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    include: { service: true, payment: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.payment) throw new Error("Payment already exists");

  // ✅ Pre-create a PENDING payment for Stripe
  await prisma.payment.create({
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
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    metadata: { bookingId: booking.id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(booking.service.price * 100),
          product_data: { name: booking.service.title },
        },
      },
    ],
  });

  return { url: session.url };
};

export const PaymentService = {
  createPayment,
  getMyPayments,
  getPaymentById,
  createStripeCheckoutSession,
};