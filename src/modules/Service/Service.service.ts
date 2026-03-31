import { prisma } from "../../lib/prisma";

// ===== PUBLIC =====
const getAllServices = () =>
  prisma.service.findMany({
    include: { category: true, provider: true },
    orderBy: { createdAt: "desc" },
  });

const getServiceById = (id: string) =>
  prisma.service.findUnique({
    where: { id },
    include: { category: true, provider: true },
  });

const getAllCategories = () =>
  prisma.serviceCategory.findMany({ orderBy: { createdAt: "desc" } });

const getServicesByCategory = async (categoryId: string) => {
  // Find category first
  const category = await prisma.serviceCategory.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return {
      success: false,
      message: "Category not found",
      categoryName: null,
      data: [],
    };
  }

  // Fetch services with nested category
  const services = await prisma.service.findMany({
    where: { categoryId },
    select: {
      id: true,
      title: true,
      price: true,
      availability: true,
      description: true,
      image: true,
      providerId: true,
      categoryId: true,
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Map services to remove nested category object (optional)
  const data = services.map((s) => ({
    id: s.id,
    title: s.title,
    price: s.price,
    availability: s.availability,
    description: s.description,
    image: s.image,
    providerId: s.providerId,
    categoryId: s.categoryId,
  }));

  return {
    success: true,
    message: "Services for category fetched successfully",
    categoryName: category.name,
    data,
  };
};

// ===== PROVIDER / ADMIN =====
const updateService = async (serviceId: string, data: any) => {
  try {
    const updated = await prisma.service.update({
      where: { id: serviceId },
      data,
    });
    return updated;
  } catch (error) {
    throw error;
  }
};

const deleteService = async (serviceId: string) => {
  try {
    const deleted = await prisma.service.delete({
      where: { id: serviceId },
    });
    return deleted;
  } catch (error) {
    throw error;
  }
};

export const ServiceService = {
  getAllServices,
  getServiceById,
  getAllCategories,
  getServicesByCategory,
  updateService,
  deleteService,
};