import { Request, Response } from "express";
import { ReviewService } from "./review.service";

const addReview = async (req: Request, res: Response) => {
  const { serviceId, rating, comment } = req.body;
  try {
    const review = await ReviewService.addReview(req.user!.id, serviceId, rating, comment);
    res.json({ success: true, data: review });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getReviewsForService = async (req: Request, res: Response) => {
  try {
    const reviews = await ReviewService.getReviewsForService(req.params.serviceId as string);
    res.json({ success: true, data: reviews });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const ReviewController = {
  addReview,
  getReviewsForService,
};