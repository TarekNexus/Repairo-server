import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { BookingController } from "./booking.controller"; // renamed

const router = Router();

// Fetch all bookings (for provider or admin)
router.get("/", auth(UserRole.PROVIDER, UserRole.ADMIN), BookingController.getBookings);

// Update booking status (provider, admin, or customer)
router.patch(
  "/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN, UserRole.CUSTOMER),
  BookingController.updateBookingStatus
);

export const BookingRouter: Router = router; // renamed