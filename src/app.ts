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

// Stripe Webhook must come BEFORE JSON parser
app.use("/api/payment/webhook", express.raw({ type: "application/json" }), PaymentWebhookRouter);


// CORS
app.use(cors({ origin: [process.env.FRONTEND_URL!, "http://localhost:3000"], credentials: true }));

// Better Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON parser
app.use(express.json());

// Health check
app.get("/", (req: Request, res: Response) => res.status(200).json({ success: true, message: "Repairo server is running!" }));

// Routes
app.use("/api/admin", AdminRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/provider", ProviderRouter);
app.use("/api/users", userRouter);
app.use("/api/payment", PaymentRouter);

export default app;