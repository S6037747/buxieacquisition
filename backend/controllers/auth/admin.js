import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

export const admin = async (request, response) => {
  const { userId, totpReset, promote, userIdAction } = request.body;

  try {
    const user = await userModel.findById(userId);

    if (user.role !== "admin") {
      const log = new logModel({
        type: "CompanyAPI",
        method: "Get",
        actionBy: userId,
        description:
          "User tried accessing admin controls without the right authorization.",
      });

      await log.save();

      return response.json({
        success: false,
        message: "User not Authorized.",
      });
    }

    const userAction = await userModel.findById(userIdAction);

    if (totpReset) {
      userAction.totpActive = false;

      await userAction.save();

      const log = new logModel({
        type: "CompanyAPI",
        method: "Patch",
        actionBy: userId,
        description: `User resetted 2FA of user: ${userIdAction}.`,
      });

      await log.save();

      return response.json({
        success: true,
        message: "Reset successfull! Setup of 2FA can be done after login.",
      });
    }

    if (promote) {
      userAction.role = "admin";

      userAction.save();

      const log = new logModel({
        type: "CompanyAPI",
        method: "Patch",
        actionBy: userId,
        description: `User promoted ${userIdAction} to admin.`,
      });

      await log.save();

      return response.json({
        success: true,
        message: "User promoted to admin.",
      });
    }
  } catch (error) {
    // Catch if a error occurs
    const log = new logModel({
      type: "CompanyAPI",
      actionBy: userId,
      description: `The following error occured in admin.js: ${error.message}`,
    });

    await log.save();

    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default admin;
