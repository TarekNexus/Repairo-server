import express, { Request, Response } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

import { AdminRouter } from "./modules/admin/admin.router";
import { CustomerRouter } from "./modules/customer/customer.router";
import { BookingRouter } from "./modules/booking/booking.router";
import { ReviewRouter } from "./modules/review/review.router";
import { userRouter } from "./modules/user/user.router";
import { serviceRouter } from "./modules/Service/Service.router";
import { ProviderRouter } from "./modules/provider/provider.router";
import { PaymentRouter, PaymentWebhookRouter } from "./modules/payment/payment.router";

const app = express();

// ✅ Step 1: Webhook MUST come before express.json()
// Stripe needs raw Buffer body to verify signature
app.use("/api/payment/webhook/stripe", PaymentWebhookRouter);

// ✅ Step 2: CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL!,
    credentials: true,
  })
);

// ✅ Step 3: Better Auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// ✅ Step 4: Global JSON parser (comes AFTER webhook)
app.use(express.json());

// ✅ Step 5: Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Repairo server is running!" });
});

// ✅ Step 6: All other routes
app.use("/api/admin", AdminRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/provider", ProviderRouter);
app.use("/api/users", userRouter);
app.use("/api/payment", PaymentRouter);

export default app;