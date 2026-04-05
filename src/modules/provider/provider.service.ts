import { prisma } from "../../lib/prisma";

// ===== SERVICES =====
const addService = async (providerId: string, data: any) => {
  try {
    const category = await prisma.serviceCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error(`Category with id ${data.categoryId} does not exist`);
    }

    const service = await prisma.service.create({
      data: { ...data, providerId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        image: true,
        location: true,
        availability: true,
        providerId: true,
        categoryId: true,
      },
    });

    return {
      success: true,
      message: "Service added successfully",
      data: service,
    };
  } catch (error) {
    throw error;
  }
};

const updateService = async (
  providerId: string,
  serviceId: string,
  data: any,
) => {
  try {
    const result = await prisma.service.updateMany({
      where: { id: serviceId, providerId },
      data,
    });

    if (result.count === 0) {
      throw new Error("Service not found or not authorized");
    }

    return {
      success: true,
      message: "Service updated successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

const deleteService = async (providerId: string, serviceId: string) => {
  try {
    const result = await prisma.service.deleteMany({
      where: { id: serviceId, providerId },
    });

    if (result.count === 0) {
      throw new Error("Service not found or not authorized");
    }

    return {
      success: true,
      message: "Service deleted successfully",
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

// ===== GET PROVIDER'S SERVICES =====
const getMyServices = async (providerId: string) => {
  try {
    const services = await prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        image: true,
        location: true,
        availability: true,
        providerId: true,
        category: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    return {
      success: true,
      message: "My services fetched successfully",
      data: services,
    };
  } catch (error) {
    throw error;
  }
};

// ===== GET BOOKINGS FOR PROVIDER =====
const getBookings = async (providerId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { providerId },
    include: {
      customer: true,
      service: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings;
};

// ===== EXPORT =====
export const ProviderService = {
  addService,
  updateService,
  deleteService,
  getMyServices,
  getBookings,
};
