
import { Request, Response } from "express";
import { UserService } from "./user.service";

// =====================
// CURRENT USER
// =====================
const getMe = async (req: any, res: Response) => {
  try {
    const user = await UserService.getMeFromDB(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message || error,
    });
  }
};

const updateMe = async (req: any, res: Response) => {
  try {
    const updated = await UserService.updateMeInDB(req.user.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Update me error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update profile",
      error: error.message || error,
    });
  }
};

// =====================
// ADMIN
// =====================
 const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsersFromDB();

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error: any) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message || error,
    });
  }
};

const banUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.banUserInDB(
      req.params.id as string,
      req.body.isBanned
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${req.body.isBanned ? "banned" : "unbanned"} successfully`,
      data: user,
    });
  } catch (error: any) {
    console.error("Ban user error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update ban status",
      error: error.message || error,
    });
  }
};

 const changeRole = async (req: Request, res: Response) => {
  try {
    const user = await UserService.changeUserRoleInDB(
      req.params.id as string,
      req.body.role
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Change role error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to change user role",
      error: error.message || error,
    });
  }
};




export const userController = {
  getMe ,
  updateMe,
  getAllUsers,
  banUser,
  changeRole,
};

