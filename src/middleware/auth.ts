import { prisma } from "../lib/prisma"; // make sure prisma is imported
import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
      };
    }
  }
}

const auth = (...allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1️⃣ Get session
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // 2️⃣ Fetch user from database
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, isBanned: true, name: true, email: true },
      });

      if (!dbUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // 3️⃣ Attach user info to request
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: dbUser.role as UserRole,
      };

      // 4️⃣ Block banned users
  if (dbUser.isBanned && dbUser.role !== UserRole.ADMIN) {
  return res.status(403).json({ success: false, message: "Your account has been banned" });
}
      // 5️⃣ Role-based access control
      if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role as UserRole)) {
        return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
