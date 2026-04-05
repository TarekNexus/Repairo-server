import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { CustomerController } from "./customer.controller";

const router = Router();

// ---------------- Profile ----------------
router.get("/profile", auth(UserRole.CUSTOMER), CustomerController.getProfile);

router.patch(
  "/profile",
  auth(UserRole.CUSTOMER),
  CustomerController.updateProfile,
);

// ---------------- Bookings ----------------
router.get(
  "/bookings",
  auth(UserRole.CUSTOMER),
  CustomerController.getBookings,
);

router.get(
  "/bookings/:id",
  auth(UserRole.CUSTOMER),
  CustomerController.getBookingById,
);

router.post(
  "/bookings",
  auth(UserRole.CUSTOMER),
  CustomerController.createBooking,
);

router.patch(
  "/bookings/:id/cancel",
  auth(UserRole.CUSTOMER),
  CustomerController.cancelBooking,
);

// ---------------- Reviews ----------------
router.post("/reviews", auth(UserRole.CUSTOMER), CustomerController.addReview);

router.get("/reviews/:serviceId", CustomerController.getReviewsForService);

export const CustomerRouter = router;
