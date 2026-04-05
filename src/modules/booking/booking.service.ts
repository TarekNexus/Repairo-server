import { BookingStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";

// Get all bookings for the provider's services
const getBookings = async (userId: string, userRole: string) => {
  const whereClause =
    userRole === UserRole.ADMIN
      ? {} // Admin sees all bookings
      : {
          OR: [
            { providerId: userId }, // provider sees their bookings
            { customerId: userId }, // customer sees their bookings
          ],
        };

  return prisma.booking.findMany({
    where: whereClause,
    include: {
      service: true,
      customer: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Update booking status
const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  user: { id: string; role: string },
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error("Booking not found");

  // CUSTOMER RULES
  if (user.role === "CUSTOMER") {
    if (booking.customerId !== user.id) {
      throw new Error("You can only cancel your own bookings");
    }
    if (status !== BookingStatus.CANCELLED) {
      throw new Error("Customer can only cancel a booking");
    }
    if (booking.bookingStatus !== BookingStatus.PENDING) {
      throw new Error("Booking cannot be cancelled now");
    }
  }

  // PROVIDER RULES
  if (user.role === "SELLER") {
    if (status === BookingStatus.CANCELLED) {
      throw new Error("Provider cannot cancel a booking");
    }
  }

  // COMMON RULES
  if (
    booking.bookingStatus === BookingStatus.COMPLETED ||
    booking.bookingStatus === BookingStatus.CANCELLED
  ) {
    throw new Error(`Booking already ${booking.bookingStatus}`);
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { bookingStatus: status },
    include: {
      service: true,
      customer: true,
      payment: true,
    },
  });
};

// ===== EXPORT =====
export const BookingService = {
  getBookings,
  updateBookingStatus,
};
