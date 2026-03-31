import { prisma } from "../../lib/prisma";

// Add a review for a service
const addReview = (customerId: string, serviceId: string, rating: number, comment: string) =>
  prisma.review.create({
    data: { customerId, serviceId, rating, comment },
    include: { customer: true },
  });

// Get all reviews for a service
const getReviewsForService = (serviceId: string) =>
  prisma.review.findMany({
    where: { serviceId },
    include: { customer: true }, // include reviewer info
    orderBy: { createdAt: "desc" },
  });

export const ReviewService = {
  addReview,
  getReviewsForService,
};