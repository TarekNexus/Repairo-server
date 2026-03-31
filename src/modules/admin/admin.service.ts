import { prisma } from "../../lib/prisma";

// ===== USERS =====
const getAllUsers = () =>
  prisma.user.findMany({ orderBy: { createdAt: "desc" } });

const getUserById = (userId: string) =>
  prisma.user.findUnique({ where: { id: userId } });

const updateUserRole = (userId: string, data: any) =>
  prisma.user.update({
    where: { id: userId },
    data,
  });

const toggleUserBan = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("USER_NOT_FOUND");

  return prisma.user.update({
    where: { id },
    data: { isBanned: !user.isBanned },
  });
};

// ===== SERVICES =====
const getAllServices = () =>
  prisma.service.findMany({
    include: { provider: true, category: true },
    orderBy: { createdAt: "desc" },
  });

// ===== BOOKINGS =====
const getAllBookings = () =>
  prisma.booking.findMany({
    include: { customer: true, service: true, payment: true },
    orderBy: { createdAt: "desc" },
  });

// ===== SERVICE CATEGORIES =====
const getAllServiceCategories = () =>
  prisma.serviceCategory.findMany({ orderBy: { createdAt: "desc" } });

const addServiceCategory = (data: any) =>
  prisma.serviceCategory.create({ data });

const updateServiceCategory = (categoryId: string, data: any) =>
  prisma.serviceCategory.update({ where: { id: categoryId }, data });

const deleteServiceCategory = async (id: string) => {
  const category = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!category) throw new Error("CATEGORY_NOT_FOUND");

  return prisma.serviceCategory.delete({ where: { id } });
};

export const AdminService = {
  // Users
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserBan,

  // Services
  getAllServices,

  // Bookings
  getAllBookings,

  // Categories
  getAllServiceCategories,
  addServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
};