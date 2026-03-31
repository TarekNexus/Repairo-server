import express from "express";
import { PaymentController } from "./payment.controller";
import auth, { UserRole } from "../../middleware/auth";

// Standard router — uses parsed JSON body via global express.json()
const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), PaymentController.createPayment);
router.get("/", auth(UserRole.CUSTOMER), PaymentController.getMyPayments);
router.get("/:id", auth(UserRole.CUSTOMER), PaymentController.getPaymentById);

// Webhook router — uses raw body, no auth middleware
const webhookRouter = express.Router();

webhookRouter.post(
  "/",
  express.raw({ type: "application/json" }), // raw body required for Stripe signature verification
  PaymentController.stripeWebhook
);

export { router as PaymentRouter, webhookRouter as PaymentWebhookRouter };