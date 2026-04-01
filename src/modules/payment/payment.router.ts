import express from "express";
import auth, { UserRole } from "../../middleware/auth";
import { PaymentController } from "./payment.controller";

const PaymentRouter = express.Router();

// Unified Payment (COD or Stripe)
PaymentRouter.post("/create", auth(UserRole.CUSTOMER), PaymentController.createPayment);

// Get My Payments
PaymentRouter.get("/", auth(UserRole.CUSTOMER), PaymentController.getMyPayments);

// Get Payment by ID
PaymentRouter.get("/:id", auth(UserRole.CUSTOMER), PaymentController.getPaymentById);

// Webhook
const PaymentWebhookRouter = express.Router();
PaymentWebhookRouter.post("/stripe", express.raw({ type: "application/json" }), PaymentController.stripeWebhook);

export { PaymentRouter, PaymentWebhookRouter };