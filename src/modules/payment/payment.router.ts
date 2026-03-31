// src/modules/payment/payment.routes.ts
import express, { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { PaymentController } from "./payment.controller";
import { stripeWebhook } from "./payment.webhook";

const router = Router();

// User endpoints
router.post(
  "/stripe-checkout",
  auth(UserRole.CUSTOMER),
  PaymentController.createStripeCheckout
);

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  PaymentController.createPayment
);

router.get(
  "/",
  auth(UserRole.CUSTOMER),
  PaymentController.getMyPayments
);

router.get(
  "/:id",
  auth(UserRole.CUSTOMER),
  PaymentController.getPaymentById
);

// Stripe webhook
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export const PaymentRouter = router;