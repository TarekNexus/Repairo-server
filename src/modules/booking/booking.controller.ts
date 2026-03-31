import { Request, Response } from "express";
import { BookingStatus } from "../../generated/prisma/enums";
import { BookingService } from "./booking.service";


// Fetch bookings for the current user (customer or provider)
const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await BookingService.getBookings(req.user!.id);
    res.status(200).json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update booking status (for provider or admin)
const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = req.user!; // { id, role }

    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await BookingService.updateBookingStatus(
      id as string,
      status as BookingStatus,
      user
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ===== EXPORT =====
export const BookingController = {
  getBookings,
  updateBookingStatus,
};