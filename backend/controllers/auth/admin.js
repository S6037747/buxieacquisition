import userModel from "../../models/userModel.js";

export const admin = async (request, response) => {
  const { userId, totpReset, promote, userIdAction } = request.body;

  try {
    const user = await userModel.findById(userId);

    if (user.role !== "admin") {
      return response.json({
        success: false,
        message: "User not Authorized.",
      });
    }

    const userAction = await userModel.findById(userIdAction);

    if (totpReset) {
      userAction.totpActive = false;

      userAction.save();
      return response.json({
        success: true,
        message: "Reset successfull! Setup of 2FA can be done after login.",
      });
    }

    if (promote) {
      userAction.role = "admin";

      userAction.save();
      return response.json({
        success: true,
        message: "User promoted to admin.",
      });
    }
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default admin;
