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

const app = express(); // ✅ declare FIRST

// ✅ Webhook BEFORE cors, express.json(), or anything else
app.use("/api/payment/webhook/stripe", PaymentWebhookRouter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL!,
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json()); // ← comes AFTER webhook

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Repairo server is running!" });
});

app.use("/api/admin", AdminRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/provider", ProviderRouter);
app.use("/api/users", userRouter);
app.use("/api/payment", PaymentRouter);

export default app;