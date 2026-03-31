import { Router } from "express";

import auth, { UserRole } from "../../middleware/auth";
import { ServiceController } from "./Service.controller";

const router = Router();

// ===== PUBLIC =====
router.get("/categories/all", ServiceController.getAllCategories);
router.get("/getServicesByCategory/:categoryId", ServiceController.getServicesByCategory);
router.get("/:id", ServiceController.getServiceById);
router.get("/", ServiceController.getAllServices);

// ===== PROVIDER / ADMIN =====
router.put("/:id", auth(UserRole.PROVIDER, UserRole.ADMIN), ServiceController.updateService);
router.delete("/:id", auth(UserRole.PROVIDER, UserRole.ADMIN), ServiceController.deleteService);

export const serviceRouter: Router = router;
