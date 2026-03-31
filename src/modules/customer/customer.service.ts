import { BookingStatus } from "../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";

interface BookingItemInput {
  serviceId: string;
  // quantity?: number; // Optional if you later add quantity field
}

// ---------------- Profile ----------------
const getProfile = async (customerId: string) => {
  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!customer) throw new Error("Customer not found");

  return customer;
};

const updateProfile = async (
  customerId: string,
  payload: { name?: string; email?: string; image?: string }
) => {
  return prisma.user.update({
    where: { id: customerId },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.email && { email: payload.email }),
      ...(payload.image && { image: payload.image }),
    },
  });
};

// ---------------- Bookings ----------------
const getBookings = async (customerId: string) => {
  return prisma.booking.findMany({
    where: { customerId },
    include: {
      customer: {
        select: { id: true, name: true, email: true, image: true }, // customer details
      },
      service: {
        include: {
          provider: {
            select: { id: true, name: true, email: true, role: true, image: true },
          },
          category: {
            select: { id: true, name: true },
          },
        },
      },
      payment: true, // <-- include payment info (method, status, amount)
    },
    orderBy: { createdAt: "desc" },
  });
};

const getBookingById = async (customerId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
     include: {
      customer: {
        select: { id: true, name: true, email: true, image: true }, // customer details
      },
      service: {
        include: {
          provider: {
            select: { id: true, name: true, email: true, role: true, image: true },
          },
          category: {
            select: { id: true, name: true },
          },
        },
      },
      payment: true, // <-- include payment info (method, status, amount)
    },
  });

  if (!booking) throw new Error("Booking not found");
  return booking;
};

const createBooking = async (
  customerId: string,
  items: BookingItemInput[],
  date: Date,
  address: string,
  phone: string,
  email?: string
) => {
  if (!items || items.length === 0)
    throw new Error("At least one service item is required");

  // Fetch all requested services
  const services = await prisma.service.findMany({
    where: { id: { in: items.map((i) => i.serviceId) } },
  });

  if (services.length !== items.length)
    throw new Error("One or more services not found");

  // Check availability
  for (const service of services) {
    if (!service.availability)
      throw new Error(`Service "${service.title}" is not available`);
  }

  // Create booking for each item
  const bookings = await prisma.$transaction(
    items.map((item) => {
      const service = services.find((s) => s.id === item.serviceId)!;
      return prisma.booking.create({
        data: {
          customerId,
          serviceId: service.id,
          providerId: service.providerId,
          date,
          address,
          phone,
          bookingStatus: BookingStatus.PENDING,
        },
        include: {
          service: { include: { provider: true, category: true } },
          payment: true,
        },
      });
    })
  );

  return bookings;
};

const cancelBooking = async (customerId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
  });

  if (!booking) throw new Error("Booking not found");

  if (booking.bookingStatus === BookingStatus.CANCELLED)
    throw new Error("Booking already cancelled");

  if (
    booking.bookingStatus === BookingStatus.COMPLETED ||
    booking.bookingStatus === BookingStatus.ON_THE_WAY
  )
    throw new Error("You cannot cancel this booking");

  return prisma.booking.update({
    where: { id: bookingId },
    data: { bookingStatus: BookingStatus.CANCELLED },
  });
};

// ---------------- Reviews ----------------
const addReview = async (
  customerId: string,
  serviceId: string,
  rating: number,
  comment?: string
) => {
  return prisma.review.create({
    data: {
      customerId,
      serviceId,
      rating,
      comment: comment || "",
    },
    include: {
      customer: { select: { id: true, name: true, image: true } }, // include customer details
    },
  });
};

const getReviewsForService = async (serviceId: string) => {
  return prisma.review.findMany({
    where: { serviceId },
    include: {
      customer: { select: { id: true, name: true, image: true } }, // customer info
      service: { select: { id: true, title: true, price: true } }, // optional: service info
    },
    orderBy: { createdAt: "desc" },
  });
};

export const CustomerService = {
  getProfile,
  updateProfile,
  getBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  addReview,
  getReviewsForService,
};