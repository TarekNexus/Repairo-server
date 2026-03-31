import { Request, Response } from "express";
import { ProviderService } from "./provider.service";


// ===== SERVICES =====
const addService = async (req: Request, res: Response) => {
  try {
    const service = await ProviderService.addService(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: service,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add service",
      error: error.message || error,
    });
  }
};

const updateService = async (req: Request, res: Response) => {
  try {
    const service = await ProviderService.updateService(
      req.user!.id,
      req.params.id as string,
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
    const result = await ProviderService.deleteService(
      req.user!.id,
      req.params.id as string
    );
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: result,
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

const getMyServices = async (req: Request, res: Response) => {
  try {
    const services = await ProviderService.getMyServices(req.user!.id);
    res.status(200).json({
      success: true,
      message: "My services fetched successfully",
      data: services.data,
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

const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await ProviderService.getBookings(req.user!.id);
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ===== EXPORT =====
export const ProviderController = {
  addService,
  updateService,
  deleteService,
  getMyServices,
  getBookings,
};