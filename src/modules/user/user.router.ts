import { Router } from "express";

import auth, { UserRole } from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

// =====================
// CURRENT USER ROUTES
// =====================
router.get("/me", auth(), userController.getMe);
router.patch("/me", auth(), userController.updateMe);

// =====================
// ADMIN ROUTES
// =====================
router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);
router.patch("/:id/ban", auth(UserRole.ADMIN), userController.banUser);
router.patch("/:id/role", auth(UserRole.ADMIN), userController.changeRole);


export const userRouter: Router = router;