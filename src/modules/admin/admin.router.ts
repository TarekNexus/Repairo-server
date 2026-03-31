import { Router } from "express";
import { AdminController } from "./admin.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

// ===== USERS =====
router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.get("/users/:id", auth(UserRole.ADMIN), AdminController.getUserById);
router.patch("/users/:id", auth(UserRole.ADMIN), AdminController.updateUserRole);
router.patch("/users/ban/:id", auth(UserRole.ADMIN), AdminController.toggleUserBan);

// ===== SERVICES =====
router.get("/services", auth(UserRole.ADMIN), AdminController.getAllServices);

// ===== BOOKINGS =====
router.get("/bookings", auth(UserRole.ADMIN), AdminController.getAllBookings);

// ===== SERVICE CATEGORIES =====
router.get("/categories", auth(UserRole.ADMIN), AdminController.getAllServiceCategories);
router.post("/categories", auth(UserRole.ADMIN), AdminController.addServiceCategory);
router.put("/categories/:id", auth(UserRole.ADMIN), AdminController.updateServiceCategory);
router.delete("/categories/:id", auth(UserRole.ADMIN), AdminController.deleteServiceCategory);

export const AdminRouter = router;