import bcrypt from "bcryptjs";
import crypto from "crypto";
import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

const resetPassword = async (request, response) => {
  const { token, newPassword } = request.body;

  if (!token) {
    return response.json({
      success: false,
      tokenAuth: false,
      message: "Missing details.",
    });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({ ResetToken: tokenHash });

    if (!user || user.ResetToken !== tokenHash || user.ResetToken === "") {
      return response.json({
        success: false,
        tokenAuth: false,
        message: "Token invalid.",
      });
    }

    if (user.ResetTokenExpireAt < Date.now()) {
      return response.json({
        success: false,
        tokenAuth: false,
        message: "Token Expired.",
      });
    }

    if (!newPassword && user.ResetToken === tokenHash) {
      return response.json({
        success: false,
        tokenAuth: true,
        message: "Token valid.",
      });
    }

    // Encrypting password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.ResetToken = "";
    user.ResetTokenExpireAt = 0;

    await user.save();

    const log = new logModel({
      type: "AuthAPI",
      actionBy: user._id,
      method: "Patch",
      description: `User resetted password succesfully!`,
    });

    await log.save();

    return response.json({
      success: true,
      message: "Password succesfully changed!",
    });
  } catch (error) {
    // Catch if a error occurs

    const log = new logModel({
      type: "AuthAPI",
      actionBy: user._id,
      method: "Patch",
      description: `The following error occured in resetPassword.js: ${error.message}`,
    });

    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default resetPassword;
