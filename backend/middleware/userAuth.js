import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import logModel from "../models/logModel.js";

const userAuth = async (request, response, next) => {
  const { token } = request.cookies;

  if (!token) {
    return response.json({
      success: false,
      message: "Not authorized, please login",
    });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      request.body = request.body || {};
      request.body.userId = tokenDecode.id;

      const user = await userModel.findById(tokenDecode.id);

      if (!user) {
        response.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
      }

      const today = new Date().toDateString();
      const lastActiveDay =
        user.lastActive instanceof Date ? user.lastActive.toDateString() : "";

      if (lastActiveDay !== today) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        response.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        user.lastActive = new Date();
        await user.save();

        const log = new logModel({
          type: "AuthAPI",
          actionBy: user._id,
          method: "Post",
          description: `User cookies got refreshed due to activity.`,
        });

        await log.save();
      }
    } else {
      return response.json({
        success: false,
        message: "Not authorized, please login",
      });
    }

    next();
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default userAuth;
