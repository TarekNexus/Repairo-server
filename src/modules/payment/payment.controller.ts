import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

/**
 * Create a payment (COD or Stripe)
 */
const createPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, method } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({
        success: false,
        message: "bookingId and method are required",
      });
    }

    const payment = await PaymentService.createPayment(
      req.user!.id, // authenticated user id
      bookingId,
      method
    );

    res.status(201).json({
      success: true,
      message:
        method === "CASH_ON_DELIVERY"
          ? "COD payment created successfully"
          : "Stripe checkout session created successfully",
      data: payment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all payments for the authenticated user
 */
const getMyPayments = async (req: Request, res: Response) => {
  try {
    const payments = await PaymentService.getMyPayments(req.user!.id);

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get a specific payment by ID for the authenticated user
 */
const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Payment id is required",
      });
    }

    const payment = await PaymentService.getPaymentById(req.user!.id, id);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create a Stripe Checkout Session for a booking
 */
const createStripeCheckout = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "bookingId is required",
      });
    }

    const session = await PaymentService.createStripeCheckoutSession(
      req.user!.id,
      bookingId
    );

    res.status(200).json({
      success: true,
      message: "Stripe checkout session created successfully",
      data: session,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const PaymentController = {
  createPayment,
  getMyPayments,
  getPaymentById,
  createStripeCheckout,
};