import userModel from "../models/userModel.js";

export const getUserData = async (request, response) => {
  try {
    const { userId } = request.body;

    const user = await userModel.findById(userId);

    if (!user) {
      if (!userId) {
        return response.json({
          success: false,
          message: "User not found",
        });
      } else {
        response.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return response.json({
          success: false,
          loggedOut: true,
          message: "Deleted outdated cookies",
        });
      }
    }

    return response.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        role: user.role,
        userId: user._id,
      },
    });
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUserData = async (request, response) => {
  try {
    const { userId } = request.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return response.json({
        success: false,
        message: "User not Authenticated",
      });
    }

    if (user.role !== "admin") {
      return response.json({
        success: false,
        message: "User not Authorized",
      });
    }

    const users = await userModel.find();

    return response.json({
      success: true,
      users: users,
    });
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};
