import { Request, Response } from "express";
import { CustomerService } from "./customer.service";

// --------- PROFILE ---------
const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await CustomerService.getProfile(req.user!.id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const profile = await CustomerService.updateProfile(req.user!.id, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// --------- BOOKINGS ---------
const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await CustomerService.getBookings(req.user!.id);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "id is required and must be a string",
      });
    }

    const booking = await CustomerService.getBookingById(req.user!.id, id);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const { items, date, address, phone, email } = req.body;

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items array is required with at least one service",
      });
    }

    // Check each item has a serviceId
    for (const item of items) {
      if (!item.serviceId) {
        return res.status(400).json({
          success: false,
          message: "Each item must include a serviceId",
        });
      }
    }

    // Validate date, address, and phone
    if (!date || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "date, address, and phone are required",
      });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date",
      });
    }

    if (bookingDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date must be in the future",
      });
    }

    // Call service to create booking
    const booking = await CustomerService.createBooking(
      req.user!.id,
      items,
      bookingDate,
      address,
      phone,
      email,
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "id is required and must be a string",
      });
    }

    const booking = await CustomerService.cancelBooking(req.user!.id, id);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// --------- REVIEWS ---------
const addReview = async (req: Request, res: Response) => {
  try {
    const { serviceId, rating, comment } = req.body;

    if (!serviceId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "serviceId and rating are required",
      });
    }

    const review = await CustomerService.addReview(
      req.user!.id, // customerId from authenticated user
      serviceId,
      Number(rating),
      comment,
    );

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getReviewsForService = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "serviceId is required and must be a string",
      });
    }

    const reviews = await CustomerService.getReviewsForService(serviceId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const CustomerController = {
  getProfile,
  updateProfile,
  getBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  addReview,
  getReviewsForService,
};
