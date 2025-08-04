import logModel from "../../models/logModel.js";

const logout = async (request, response) => {
  try {
    response.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    const log = new logModel({
      type: "AuthAPI",
      actionBy: request.userId,
      method: "Post",
      description: `User logged out!`,
    });

    await log.save();

    return response.json({
      success: true,
      message: "Logged out.",
    });
  } catch (error) {
    // Catch if a error occurs

    const log = new logModel({
      type: "AuthAPI",
      actionBy: request.userId,
      method: "Post",
      description: `The following error has occured in logout.js: ${error.message}`,
    });

    await log.save();

    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default logout;
