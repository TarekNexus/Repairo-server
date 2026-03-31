import { Request, Response } from "express";
import { ServiceService } from "./Service.service";


// ===== PUBLIC =====
const getAllServices = async (_req: Request, res: Response) => {
  try {
    const services = await ServiceService.getAllServices();

    res.status(200).json({
      success: true,
      message: "All services fetched successfully",
      data: services,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message || error,
    });
  }
};

const getServiceById = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;

    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await ServiceService.getServiceById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      data: service,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message || error,
    });
  }
};

const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await ServiceService.getAllCategories();

    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: categories,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message || error,
    });
  }
};

const getServicesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const result = await ServiceService.getServicesByCategory(categoryId);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services by category",
      error: error.message || error,
    });
  }
};

// ===== PROVIDER =====
const updateService = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;

    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await ServiceService.updateService(
      serviceId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: "Failed to update service",
      error: error.message || error,
    });
  }
};

const deleteService = async (req: Request, res: Response) => {
  try {
    const serviceId = req.params.id;

    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const deleted = await ServiceService.deleteService(serviceId);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: "Failed to delete service",
      error: error.message || error,
    });
  }
};

export const ServiceController = {
  getAllServices,
  getServiceById,
  getServicesByCategory,
  getAllCategories,
  updateService,
  deleteService,
};