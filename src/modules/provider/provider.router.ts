import { Router } from "express";
import { ProviderController } from "./provider.controller"; // rename controller too
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

// ===== SERVICES =====
router.get("/bookings", auth(UserRole.PROVIDER, UserRole.ADMIN), ProviderController.getBookings);
router.post("/services", auth(UserRole.PROVIDER, UserRole.ADMIN), ProviderController.addService);
router.put("/services/:id", auth(UserRole.PROVIDER, UserRole.ADMIN), ProviderController.updateService);
router.delete("/services/:id", auth(UserRole.PROVIDER, UserRole.ADMIN), ProviderController.deleteService);
router.get("/my-services", auth(UserRole.PROVIDER), ProviderController.getMyServices);

export const ProviderRouter: Router = router;