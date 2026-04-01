import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { stripeWebhook } from "./payment.webhook";

const createPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, method } = req.body;
    if (!bookingId || !method) throw new Error("bookingId and method are required");

    let result;
    if (method === "CASH_ON_DELIVERY") {
      result = await PaymentService.createCashOnDeliveryPayment(req.user!.id, bookingId);
      return res.status(201).json({
        success: true,
        message: "Cash on Delivery payment created successfully",
        data: result,
      });
    } else if (method === "STRIPE") {
      result = await PaymentService.createStripeCheckout(req.user!.id, bookingId);
      return res.status(201).json({
        success: true,
        message: "Stripe checkout session created successfully",
        data: result,
      });
    } else {
      throw new Error("Invalid payment method");
    }
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyPayments = async (req: Request, res: Response) => {
  try {
    const result = await PaymentService.getMyPayments(req.user!.id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPaymentById = async (req: Request, res: Response) => {
  try {
    const result = await PaymentService.getPaymentById(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const PaymentController = {
  createPayment,
  getMyPayments,
  getPaymentById,
  stripeWebhook,
};