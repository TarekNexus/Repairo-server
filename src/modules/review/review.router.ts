import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { ReviewController } from "./review.controller";

const router = Router();

// Only customers can add reviews
router.post("/", auth(UserRole.CUSTOMER), ReviewController.addReview);
router.get("/:serviceId", ReviewController.getReviewsForService);

export const ReviewRouter = router;