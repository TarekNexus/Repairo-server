// src/app.ts
import express2 from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum BookingStatus {\n  PENDING\n  ACCEPTED\n  ON_THE_WAY\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n}\n\nmodel User {\n  id            String    @id @default(cuid())\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  role          String    @default("CUSTOMER")\n  isBanned      Boolean   @default(false)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  services      Service[]\n  bookings      Booking[] @relation("CustomerBookings")\n  reviews       Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel ServiceCategory {\n  id        String   @id @default(uuid())\n  name      String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  services Service[]\n}\n\nmodel Service {\n  id           String  @id @default(uuid())\n  title        String\n  description  String\n  price        Float\n  image        String?\n  location     String?\n  availability Boolean @default(true)\n\n  providerId String\n  categoryId String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  provider User            @relation(fields: [providerId], references: [id])\n  category ServiceCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  bookings Booking[]\n  reviews  Review[]\n\n  @@index([providerId])\n  @@index([categoryId])\n}\n\nmodel Booking {\n  id            String        @id @default(uuid())\n  customerId    String\n  serviceId     String\n  providerId    String\n  date          DateTime\n  address       String\n  phone         String\n  bookingStatus BookingStatus @default(PENDING)\n  paymentStatus PaymentStatus @default(PENDING)\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n  customer      User          @relation("CustomerBookings", fields: [customerId], references: [id])\n  service       Service       @relation(fields: [serviceId], references: [id])\n  payment       Payment?\n\n  @@index([customerId])\n  @@index([serviceId])\n  @@index([providerId])\n}\n\nmodel Payment {\n  id            String        @id @default(uuid())\n  bookingId     String        @unique\n  amount        Float\n  method        String\n  transactionId String?\n  status        PaymentStatus @default(PENDING)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n}\n\nmodel Review {\n  id         String   @id @default(cuid())\n  customerId String\n  serviceId  String // must reference an existing Service.id\n  rating     Int\n  comment    String\n  createdAt  DateTime @default(now())\n\n  customer User    @relation(fields: [customerId], references: [id])\n  service  Service @relation(fields: [serviceId], references: [id])\n\n  @@index([customerId])\n  @@index([serviceId])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"CustomerBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"ServiceCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToServiceCategory"}],"dbName":null},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"image","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"availability","kind":"scalar","type":"Boolean"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"provider","kind":"object","type":"User","relationName":"ServiceToUser"},{"name":"category","kind":"object","type":"ServiceCategory","relationName":"ServiceToServiceCategory"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToService"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"bookingStatus","kind":"enum","type":"BookingStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerBookings"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"method","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"service","kind":"object","type":"Service","relationName":"ReviewToService"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var BookingStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  ON_THE_WAY: "ON_THE_WAY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";
import { oAuthProxy } from "better-auth/plugins";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL, process.env.BETTER_AUTH_URL],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
      account: {
        skipStateCookieCheck: true
      }
    }
  },
  advanced: {
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true
        }
      }
    }
  },
  plugins: [
    oAuthProxy()
  ]
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/modules/admin/admin.router.ts
import { Router } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = () => prisma.user.findMany({ orderBy: { createdAt: "desc" } });
var getUserById = (userId) => prisma.user.findUnique({ where: { id: userId } });
var updateUserRole = (userId, data) => prisma.user.update({
  where: { id: userId },
  data
});
var toggleUserBan = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("USER_NOT_FOUND");
  return prisma.user.update({
    where: { id },
    data: { isBanned: !user.isBanned }
  });
};
var getAllServices = () => prisma.service.findMany({
  include: { provider: true, category: true },
  orderBy: { createdAt: "desc" }
});
var getAllBookings = () => prisma.booking.findMany({
  include: { customer: true, service: true, payment: true },
  orderBy: { createdAt: "desc" }
});
var getAllServiceCategories = () => prisma.serviceCategory.findMany({ orderBy: { createdAt: "desc" } });
var addServiceCategory = (data) => prisma.serviceCategory.create({ data });
var updateServiceCategory = (categoryId, data) => prisma.serviceCategory.update({ where: { id: categoryId }, data });
var deleteServiceCategory = async (id) => {
  const category = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!category) throw new Error("CATEGORY_NOT_FOUND");
  return prisma.serviceCategory.delete({ where: { id } });
};
var AdminService = {
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
  deleteServiceCategory
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (_req, res) => {
  try {
    const users = await AdminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getUserById2 = async (req, res) => {
  try {
    const user = await AdminService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var updateUserRole2 = async (req, res) => {
  try {
    const user = await AdminService.updateUserRole(req.params.id, req.body);
    res.status(200).json({ success: true, message: "User role updated", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var toggleUserBan2 = async (req, res) => {
  try {
    const user = await AdminService.toggleUserBan(req.params.id);
    res.status(200).json({
      success: true,
      message: user.isBanned ? "User banned successfully" : "User unbanned successfully",
      data: user
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
var getAllServices2 = async (_req, res) => {
  try {
    const services = await AdminService.getAllServices();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getAllServiceCategories2 = async (_req, res) => {
  try {
    const categories = await AdminService.getAllServiceCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var addServiceCategory2 = async (req, res) => {
  try {
    const category = await AdminService.addServiceCategory(req.body);
    res.status(201).json({ success: true, message: "Category added", data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateServiceCategory2 = async (req, res) => {
  try {
    const category = await AdminService.updateServiceCategory(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var deleteServiceCategory2 = async (req, res) => {
  try {
    const category = await AdminService.deleteServiceCategory(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted successfully", data: category });
  } catch (error) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ success: false, message: "Category already deleted or not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
var getAllBookings2 = async (_req, res) => {
  try {
    const bookings = await AdminService.getAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var AdminController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUserRole: updateUserRole2,
  toggleUserBan: toggleUserBan2,
  getAllServices: getAllServices2,
  getAllServiceCategories: getAllServiceCategories2,
  addServiceCategory: addServiceCategory2,
  updateServiceCategory: updateServiceCategory2,
  deleteServiceCategory: deleteServiceCategory2,
  getAllBookings: getAllBookings2
};

// src/middleware/auth.ts
var auth2 = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, isBanned: true, name: true, email: true }
      });
      if (!dbUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: dbUser.role
      };
      if (dbUser.isBanned && dbUser.role !== "ADMIN" /* ADMIN */) {
        return res.status(403).json({ success: false, message: "Your account has been banned" });
      }
      if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/modules/admin/admin.router.ts
var router = Router();
router.get("/users", auth_default("ADMIN" /* ADMIN */), AdminController.getAllUsers);
router.get("/users/:id", auth_default("ADMIN" /* ADMIN */), AdminController.getUserById);
router.patch("/users/:id", auth_default("ADMIN" /* ADMIN */), AdminController.updateUserRole);
router.patch("/users/ban/:id", auth_default("ADMIN" /* ADMIN */), AdminController.toggleUserBan);
router.get("/services", auth_default("ADMIN" /* ADMIN */), AdminController.getAllServices);
router.get("/bookings", auth_default("ADMIN" /* ADMIN */), AdminController.getAllBookings);
router.get("/categories", auth_default("ADMIN" /* ADMIN */), AdminController.getAllServiceCategories);
router.post("/categories", auth_default("ADMIN" /* ADMIN */), AdminController.addServiceCategory);
router.put("/categories/:id", auth_default("ADMIN" /* ADMIN */), AdminController.updateServiceCategory);
router.delete("/categories/:id", auth_default("ADMIN" /* ADMIN */), AdminController.deleteServiceCategory);
var AdminRouter = router;

// src/modules/customer/customer.router.ts
import { Router as Router2 } from "express";

// src/generated/prisma/internal/prismaNamespaceBrowser.ts
import * as runtime3 from "@prisma/client/runtime/index-browser";
var NullTypes4 = {
  DbNull: runtime3.NullTypes.DbNull,
  JsonNull: runtime3.NullTypes.JsonNull,
  AnyNull: runtime3.NullTypes.AnyNull
};
var TransactionIsolationLevel2 = runtime3.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});

// src/modules/customer/customer.service.ts
var getProfile = async (customerId) => {
  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!customer) throw new Error("Customer not found");
  return customer;
};
var updateProfile = async (customerId, payload) => {
  return prisma.user.update({
    where: { id: customerId },
    data: {
      ...payload.name && { name: payload.name },
      ...payload.email && { email: payload.email },
      ...payload.image && { image: payload.image }
    }
  });
};
var getBookings = async (customerId) => {
  return prisma.booking.findMany({
    where: { customerId },
    include: {
      customer: {
        select: { id: true, name: true, email: true, image: true }
        // customer details
      },
      service: {
        include: {
          provider: {
            select: { id: true, name: true, email: true, role: true, image: true }
          },
          category: {
            select: { id: true, name: true }
          }
        }
      },
      payment: true
      // <-- include payment info (method, status, amount)
    },
    orderBy: { createdAt: "desc" }
  });
};
var getBookingById = async (customerId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    include: {
      customer: {
        select: { id: true, name: true, email: true, image: true }
        // customer details
      },
      service: {
        include: {
          provider: {
            select: { id: true, name: true, email: true, role: true, image: true }
          },
          category: {
            select: { id: true, name: true }
          }
        }
      },
      payment: true
      // <-- include payment info (method, status, amount)
    }
  });
  if (!booking) throw new Error("Booking not found");
  return booking;
};
var createBooking = async (customerId, items, date, address, phone, email) => {
  if (!items || items.length === 0)
    throw new Error("At least one service item is required");
  const services = await prisma.service.findMany({
    where: { id: { in: items.map((i) => i.serviceId) } }
  });
  if (services.length !== items.length)
    throw new Error("One or more services not found");
  for (const service of services) {
    if (!service.availability)
      throw new Error(`Service "${service.title}" is not available`);
  }
  const bookings = await prisma.$transaction(
    items.map((item) => {
      const service = services.find((s) => s.id === item.serviceId);
      return prisma.booking.create({
        data: {
          customerId,
          serviceId: service.id,
          providerId: service.providerId,
          date,
          address,
          phone,
          bookingStatus: BookingStatus.PENDING
        },
        include: {
          service: { include: { provider: true, category: true } },
          payment: true
        }
      });
    })
  );
  return bookings;
};
var cancelBooking = async (customerId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId }
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.bookingStatus === BookingStatus.CANCELLED)
    throw new Error("Booking already cancelled");
  if (booking.bookingStatus === BookingStatus.COMPLETED || booking.bookingStatus === BookingStatus.ON_THE_WAY)
    throw new Error("You cannot cancel this booking");
  return prisma.booking.update({
    where: { id: bookingId },
    data: { bookingStatus: BookingStatus.CANCELLED }
  });
};
var addReview = async (customerId, serviceId, rating, comment) => {
  return prisma.review.create({
    data: {
      customerId,
      serviceId,
      rating,
      comment: comment || ""
    },
    include: {
      customer: { select: { id: true, name: true, image: true } }
      // include customer details
    }
  });
};
var getReviewsForService = async (serviceId) => {
  return prisma.review.findMany({
    where: { serviceId },
    include: {
      customer: { select: { id: true, name: true, image: true } },
      // customer info
      service: { select: { id: true, title: true, price: true } }
      // optional: service info
    },
    orderBy: { createdAt: "desc" }
  });
};
var CustomerService = {
  getProfile,
  updateProfile,
  getBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  addReview,
  getReviewsForService
};

// src/modules/customer/customer.controller.ts
var getProfile2 = async (req, res) => {
  try {
    const profile = await CustomerService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var updateProfile2 = async (req, res) => {
  try {
    const profile = await CustomerService.updateProfile(
      req.user.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getBookings2 = async (req, res) => {
  try {
    const bookings = await CustomerService.getBookings(req.user.id);
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getBookingById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "id is required and must be a string"
      });
    }
    const booking = await CustomerService.getBookingById(req.user.id, id);
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
var createBooking2 = async (req, res) => {
  try {
    const { items, date, address, phone, email } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items array is required with at least one service"
      });
    }
    for (const item of items) {
      if (!item.serviceId) {
        return res.status(400).json({
          success: false,
          message: "Each item must include a serviceId"
        });
      }
    }
    if (!date || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "date, address, and phone are required"
      });
    }
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date"
      });
    }
    if (bookingDate <= /* @__PURE__ */ new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date must be in the future"
      });
    }
    const booking = await CustomerService.createBooking(
      req.user.id,
      items,
      bookingDate,
      address,
      phone,
      email
    );
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var cancelBooking2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "id is required and must be a string"
      });
    }
    const booking = await CustomerService.cancelBooking(req.user.id, id);
    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var addReview2 = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;
    if (!serviceId || rating === void 0) {
      return res.status(400).json({
        success: false,
        message: "serviceId and rating are required"
      });
    }
    const review = await CustomerService.addReview(
      req.user.id,
      // customerId from authenticated user
      serviceId,
      Number(rating),
      comment
    );
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getReviewsForService2 = async (req, res) => {
  try {
    const { serviceId } = req.params;
    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "serviceId is required and must be a string"
      });
    }
    const reviews = await CustomerService.getReviewsForService(serviceId);
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var CustomerController = {
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  getBookings: getBookings2,
  getBookingById: getBookingById2,
  createBooking: createBooking2,
  cancelBooking: cancelBooking2,
  addReview: addReview2,
  getReviewsForService: getReviewsForService2
};

// src/modules/customer/customer.router.ts
var router2 = Router2();
router2.get(
  "/profile",
  auth_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.getProfile
);
router2.patch(
  "/profile",
  auth_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.updateProfile
);
router2.get(
  "/bookings",
  auth_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.getBookings
);
router2.get(
  "/bookings/:id",
  auth_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.getBookingById
);
router2.post(
  "/bookings",
  auth_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.createBooking
);
router2.patch(
  "/bookings/:id/cancel",
  auth_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.cancelBooking
);
router2.post(
  "/reviews",
  auth_default("CUSTOMER" /* CUSTOMER */),
  CustomerController.addReview
);
router2.get(
  "/reviews/:serviceId",
  CustomerController.getReviewsForService
);
var CustomerRouter = router2;

// src/modules/booking/booking.router.ts
import { Router as Router3 } from "express";

// src/modules/booking/booking.service.ts
var getBookings3 = async (userId) => {
  return prisma.booking.findMany({
    where: {
      OR: [
        { providerId: userId },
        // provider sees their bookings
        { customerId: userId }
        // customer sees their bookings
      ]
    },
    include: {
      service: true,
      customer: true,
      payment: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateBookingStatus = async (bookingId, status, user) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) throw new Error("Booking not found");
  if (user.role === "CUSTOMER") {
    if (booking.customerId !== user.id) {
      throw new Error("You can only cancel your own bookings");
    }
    if (status !== BookingStatus.CANCELLED) {
      throw new Error("Customer can only cancel a booking");
    }
    if (booking.bookingStatus !== BookingStatus.PENDING) {
      throw new Error("Booking cannot be cancelled now");
    }
  }
  if (user.role === "SELLER") {
    if (status === BookingStatus.CANCELLED) {
      throw new Error("Provider cannot cancel a booking");
    }
  }
  if (booking.bookingStatus === BookingStatus.COMPLETED || booking.bookingStatus === BookingStatus.CANCELLED) {
    throw new Error(`Booking already ${booking.bookingStatus}`);
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data: { bookingStatus: status },
    include: {
      service: true,
      customer: true,
      payment: true
    }
  });
};
var BookingService = {
  getBookings: getBookings3,
  updateBookingStatus
};

// src/modules/booking/booking.controller.ts
var getBookings4 = async (req, res) => {
  try {
    const bookings = await BookingService.getBookings(req.user.id);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateBookingStatus2 = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = req.user;
    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status"
      });
    }
    const booking = await BookingService.updateBookingStatus(
      id,
      status,
      user
    );
    res.status(200).json({
      success: true,
      message: "Booking status updated",
      data: booking
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var BookingController = {
  getBookings: getBookings4,
  updateBookingStatus: updateBookingStatus2
};

// src/modules/booking/booking.router.ts
var router3 = Router3();
router3.get("/", auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */), BookingController.getBookings);
router3.patch(
  "/:id",
  auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */),
  BookingController.updateBookingStatus
);
var BookingRouter = router3;

// src/modules/review/review.router.ts
import { Router as Router4 } from "express";

// src/modules/review/review.service.ts
var addReview3 = (customerId, serviceId, rating, comment) => prisma.review.create({
  data: { customerId, serviceId, rating, comment },
  include: { customer: true }
});
var getReviewsForService3 = (serviceId) => prisma.review.findMany({
  where: { serviceId },
  include: { customer: true },
  // include reviewer info
  orderBy: { createdAt: "desc" }
});
var ReviewService = {
  addReview: addReview3,
  getReviewsForService: getReviewsForService3
};

// src/modules/review/review.controller.ts
var addReview4 = async (req, res) => {
  const { serviceId, rating, comment } = req.body;
  try {
    const review = await ReviewService.addReview(req.user.id, serviceId, rating, comment);
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var getReviewsForService4 = async (req, res) => {
  try {
    const reviews = await ReviewService.getReviewsForService(req.params.serviceId);
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var ReviewController = {
  addReview: addReview4,
  getReviewsForService: getReviewsForService4
};

// src/modules/review/review.router.ts
var router4 = Router4();
router4.post("/", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.addReview);
router4.get("/:serviceId", ReviewController.getReviewsForService);
var ReviewRouter = router4;

// src/modules/user/user.router.ts
import { Router as Router5 } from "express";

// src/modules/user/user.service.ts
var getMeFromDB = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isBanned: true,
      createdAt: true
    }
  });
};
var updateMeInDB = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      image: data.image
    }
  });
};
var getAllUsersFromDB = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var banUserInDB = async (id, isBanned) => {
  return prisma.user.update({
    where: { id },
    data: { isBanned }
  });
};
var changeUserRoleInDB = async (id, role) => {
  return prisma.user.update({
    where: { id },
    data: { role }
  });
};
var UserService = {
  getMeFromDB,
  updateMeInDB,
  getAllUsersFromDB,
  banUserInDB,
  changeUserRoleInDB
};

// src/modules/user/user.controller.ts
var getMe = async (req, res) => {
  try {
    const user = await UserService.getMeFromDB(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message || error
    });
  }
};
var updateMe = async (req, res) => {
  try {
    const updated = await UserService.updateMeInDB(req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Update me error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update profile",
      error: error.message || error
    });
  }
};
var getAllUsers3 = async (_req, res) => {
  try {
    const users = await UserService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message || error
    });
  }
};
var banUser = async (req, res) => {
  try {
    const user = await UserService.banUserInDB(
      req.params.id,
      req.body.isBanned
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: `User ${req.body.isBanned ? "banned" : "unbanned"} successfully`,
      data: user
    });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update ban status",
      error: error.message || error
    });
  }
};
var changeRole = async (req, res) => {
  try {
    const user = await UserService.changeUserRoleInDB(
      req.params.id,
      req.body.role
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    });
  } catch (error) {
    console.error("Change role error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to change user role",
      error: error.message || error
    });
  }
};
var userController = {
  getMe,
  updateMe,
  getAllUsers: getAllUsers3,
  banUser,
  changeRole
};

// src/modules/user/user.router.ts
var router5 = Router5();
router5.get("/me", auth_default(), userController.getMe);
router5.patch("/me", auth_default(), userController.updateMe);
router5.get("/", auth_default("ADMIN" /* ADMIN */), userController.getAllUsers);
router5.patch("/:id/ban", auth_default("ADMIN" /* ADMIN */), userController.banUser);
router5.patch("/:id/role", auth_default("ADMIN" /* ADMIN */), userController.changeRole);
var userRouter = router5;

// src/modules/Service/Service.router.ts
import { Router as Router6 } from "express";

// src/modules/Service/Service.service.ts
var getAllServices3 = () => prisma.service.findMany({
  include: { category: true, provider: true },
  orderBy: { createdAt: "desc" }
});
var getServiceById = (id) => prisma.service.findUnique({
  where: { id },
  include: { category: true, provider: true }
});
var getAllCategories = () => prisma.serviceCategory.findMany({ orderBy: { createdAt: "desc" } });
var getServicesByCategory = async (categoryId) => {
  const category = await prisma.serviceCategory.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    return {
      success: false,
      message: "Category not found",
      categoryName: null,
      data: []
    };
  }
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
      category: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  const data = services.map((s) => ({
    id: s.id,
    title: s.title,
    price: s.price,
    availability: s.availability,
    description: s.description,
    image: s.image,
    providerId: s.providerId,
    categoryId: s.categoryId
  }));
  return {
    success: true,
    message: "Services for category fetched successfully",
    categoryName: category.name,
    data
  };
};
var updateService = async (serviceId, data) => {
  try {
    const updated = await prisma.service.update({
      where: { id: serviceId },
      data
    });
    return updated;
  } catch (error) {
    throw error;
  }
};
var deleteService = async (serviceId) => {
  try {
    const deleted = await prisma.service.delete({
      where: { id: serviceId }
    });
    return deleted;
  } catch (error) {
    throw error;
  }
};
var ServiceService = {
  getAllServices: getAllServices3,
  getServiceById,
  getAllCategories,
  getServicesByCategory,
  updateService,
  deleteService
};

// src/modules/Service/Service.controller.ts
var getAllServices4 = async (_req, res) => {
  try {
    const services = await ServiceService.getAllServices();
    res.status(200).json({
      success: true,
      message: "All services fetched successfully",
      data: services
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message || error
    });
  }
};
var getServiceById2 = async (req, res) => {
  try {
    const serviceId = req.params.id;
    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID"
      });
    }
    const service = await ServiceService.getServiceById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      data: service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message || error
    });
  }
};
var getAllCategories2 = async (_req, res) => {
  try {
    const categories = await ServiceService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message || error
    });
  }
};
var getServicesByCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }
    const result = await ServiceService.getServicesByCategory(categoryId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch services by category",
      error: error.message || error
    });
  }
};
var updateService2 = async (req, res) => {
  try {
    const serviceId = req.params.id;
    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID"
      });
    }
    const service = await ServiceService.updateService(
      serviceId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to update service",
      error: error.message || error
    });
  }
};
var deleteService2 = async (req, res) => {
  try {
    const serviceId = req.params.id;
    if (!serviceId || typeof serviceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID"
      });
    }
    const deleted = await ServiceService.deleteService(serviceId);
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deleted
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to delete service",
      error: error.message || error
    });
  }
};
var ServiceController = {
  getAllServices: getAllServices4,
  getServiceById: getServiceById2,
  getServicesByCategory: getServicesByCategory2,
  getAllCategories: getAllCategories2,
  updateService: updateService2,
  deleteService: deleteService2
};

// src/modules/Service/Service.router.ts
var router6 = Router6();
router6.get("/categories/all", ServiceController.getAllCategories);
router6.get("/getServicesByCategory/:categoryId", ServiceController.getServicesByCategory);
router6.get("/:id", ServiceController.getServiceById);
router6.get("/", ServiceController.getAllServices);
router6.put("/:id", auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */), ServiceController.updateService);
router6.delete("/:id", auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */), ServiceController.deleteService);
var serviceRouter = router6;

// src/modules/provider/provider.router.ts
import { Router as Router7 } from "express";

// src/modules/provider/provider.service.ts
var addService = async (providerId, data) => {
  try {
    const category = await prisma.serviceCategory.findUnique({
      where: { id: data.categoryId }
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
        categoryId: true
      }
    });
    return {
      success: true,
      message: "Service added successfully",
      data: service
    };
  } catch (error) {
    throw error;
  }
};
var updateService3 = async (providerId, serviceId, data) => {
  try {
    const result = await prisma.service.updateMany({
      where: { id: serviceId, providerId },
      data
    });
    if (result.count === 0) {
      throw new Error("Service not found or not authorized");
    }
    return {
      success: true,
      message: "Service updated successfully",
      data: result
    };
  } catch (error) {
    throw error;
  }
};
var deleteService3 = async (providerId, serviceId) => {
  try {
    const result = await prisma.service.deleteMany({
      where: { id: serviceId, providerId }
    });
    if (result.count === 0) {
      throw new Error("Service not found or not authorized");
    }
    return {
      success: true,
      message: "Service deleted successfully",
      data: result
    };
  } catch (error) {
    throw error;
  }
};
var getMyServices = async (providerId) => {
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
        createdAt: true
      }
    });
    return {
      success: true,
      message: "My services fetched successfully",
      data: services
    };
  } catch (error) {
    throw error;
  }
};
var getBookings5 = async (providerId) => {
  const bookings = await prisma.booking.findMany({
    where: { providerId },
    include: {
      customer: true,
      service: true,
      payment: true
    },
    orderBy: { createdAt: "desc" }
  });
  return bookings;
};
var ProviderService = {
  addService,
  updateService: updateService3,
  deleteService: deleteService3,
  getMyServices,
  getBookings: getBookings5
};

// src/modules/provider/provider.controller.ts
var addService2 = async (req, res) => {
  try {
    const service = await ProviderService.addService(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add service",
      error: error.message || error
    });
  }
};
var updateService4 = async (req, res) => {
  try {
    const service = await ProviderService.updateService(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to update service",
      error: error.message || error
    });
  }
};
var deleteService4 = async (req, res) => {
  try {
    const result = await ProviderService.deleteService(
      req.user.id,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to delete service",
      error: error.message || error
    });
  }
};
var getMyServices2 = async (req, res) => {
  try {
    const services = await ProviderService.getMyServices(req.user.id);
    res.status(200).json({
      success: true,
      message: "My services fetched successfully",
      data: services.data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message || error
    });
  }
};
var getBookings6 = async (req, res) => {
  try {
    const bookings = await ProviderService.getBookings(req.user.id);
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var ProviderController = {
  addService: addService2,
  updateService: updateService4,
  deleteService: deleteService4,
  getMyServices: getMyServices2,
  getBookings: getBookings6
};

// src/modules/provider/provider.router.ts
var router7 = Router7();
router7.get("/bookings", auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */), ProviderController.getBookings);
router7.post("/services", auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */), ProviderController.addService);
router7.put("/services/:id", auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */), ProviderController.updateService);
router7.delete("/services/:id", auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */), ProviderController.deleteService);
router7.get("/my-services", auth_default("PROVIDER" /* PROVIDER */), ProviderController.getMyServices);
var ProviderRouter = router7;

// src/modules/payment/payment.router.ts
import express, { Router as Router8 } from "express";

// src/modules/payment/payment.service.ts
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia"
});
var createPayment = async (customerId, bookingId, method) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    include: { service: true, payment: true }
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.payment) throw new Error("Payment already exists");
  if (booking.bookingStatus === "CANCELLED")
    throw new Error("Cannot pay for cancelled booking");
  if (method === "CASH_ON_DELIVERY") {
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.service.price,
        method,
        status: PaymentStatus.PENDING
      }
    });
    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: PaymentStatus.PENDING }
    });
    return payment;
  } else if (method === "STRIPE") {
    await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.service.price,
        method,
        status: PaymentStatus.PENDING
      }
    });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: { bookingId: booking.id },
      // crucial for webhook
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(booking.service.price * 100),
            product_data: { name: booking.service.title }
          }
        }
      ]
    });
    return { url: session.url };
  }
};
var getMyPayments = async (customerId) => {
  return prisma.payment.findMany({
    where: { booking: { customerId } },
    include: {
      booking: { include: { service: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getPaymentById = async (customerId, paymentId) => {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, booking: { customerId } },
    include: { booking: { include: { service: true } } }
  });
  if (!payment) throw new Error("Payment not found");
  return payment;
};
var createStripeCheckoutSession = async (customerId, bookingId) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    include: { service: true, payment: true }
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.payment) throw new Error("Payment already exists");
  await prisma.payment.create({
    data: {
      bookingId,
      amount: booking.service.price,
      method: "STRIPE",
      status: PaymentStatus.PENDING
    }
  });
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking.id}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    metadata: { bookingId: booking.id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(booking.service.price * 100),
          product_data: { name: booking.service.title }
        }
      }
    ]
  });
  return { url: session.url };
};
var PaymentService = {
  createPayment,
  getMyPayments,
  getPaymentById,
  createStripeCheckoutSession
};

// src/modules/payment/payment.controller.ts
var createPayment2 = async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    if (!bookingId || !method) {
      return res.status(400).json({
        success: false,
        message: "bookingId and method are required"
      });
    }
    const payment = await PaymentService.createPayment(
      req.user.id,
      // authenticated user id
      bookingId,
      method
    );
    res.status(201).json({
      success: true,
      message: method === "CASH_ON_DELIVERY" ? "COD payment created successfully" : "Stripe checkout session created successfully",
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getMyPayments2 = async (req, res) => {
  try {
    const payments = await PaymentService.getMyPayments(req.user.id);
    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getPaymentById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Payment id is required"
      });
    }
    const payment = await PaymentService.getPaymentById(req.user.id, id);
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
var createStripeCheckout = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "bookingId is required"
      });
    }
    const session = await PaymentService.createStripeCheckoutSession(
      req.user.id,
      bookingId
    );
    res.status(200).json({
      success: true,
      message: "Stripe checkout session created successfully",
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var PaymentController = {
  createPayment: createPayment2,
  getMyPayments: getMyPayments2,
  getPaymentById: getPaymentById2,
  createStripeCheckout
};

// src/modules/payment/payment.webhook.ts
import Stripe2 from "stripe";
var stripe2 = new Stripe2(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia"
});
var stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe2.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      return res.status(400).send("Booking ID not found in metadata");
    }
    await prisma.payment.updateMany({
      where: { bookingId },
      data: { status: PaymentStatus.PAID }
    });
    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: PaymentStatus.PAID }
    });
    console.log(`Payment for booking ${bookingId} completed.`);
  }
  res.status(200).json({ received: true });
};

// src/modules/payment/payment.router.ts
var router8 = Router8();
router8.post(
  "/stripe-checkout",
  auth_default("CUSTOMER" /* CUSTOMER */),
  PaymentController.createStripeCheckout
);
router8.post(
  "/",
  auth_default("CUSTOMER" /* CUSTOMER */),
  PaymentController.createPayment
);
router8.get(
  "/",
  auth_default("CUSTOMER" /* CUSTOMER */),
  PaymentController.getMyPayments
);
router8.get(
  "/:id",
  auth_default("CUSTOMER" /* CUSTOMER */),
  PaymentController.getPaymentById
);
router8.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
var PaymentRouter = router8;

// src/app.ts
var app = express2();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express2.json());
app.get("/", (req, res) => {
  res.json({ message: "Repairo server is running!" });
});
app.use("/api/admin", AdminRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/provider", ProviderRouter);
app.use("/api/users", userRouter);
app.use("/api/payment", PaymentRouter);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app_default.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
