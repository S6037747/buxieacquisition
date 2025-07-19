import crypto from "crypto";
import userModel from "../../models/userModel.js";
import transporter from "../../config/nodemailer.js";
import { PASSWORD_RESET_TEMPLATE } from "../../config/emailTemplates.js";
import logModel from "../../models/logModel.js";

const sendResetToken = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    const log = new logModel({
      type: "AuthAPI",
      method: "Post",
      description: `User tried to reset password without email.`,
    });

    await log.save();

    return response.json({
      success: false,
      message: "Email is required.",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return response.json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isAccountVerified) {
      return response.json({
        success: false,
        message:
          "User not activated yet. Activate your account through your invite.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex"); // 64-char token
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.ResetToken = tokenHash;
    user.ResetTokenExpireAt = Date.now() + 15 * 60 * 1000;

    const verifyUrl =
      `${process.env.CLIENT_URL || process.env.FRONTEND_URL}` +
      `/reset-password?token=${rawToken}`;

    const log = new logModel({
      type: "AuthAPI",
      actionBy: user._id,
      method: "Post",
      description: `User requested a password reset succesfully.`,
    });

    await log.save();

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset your password",
      html: PASSWORD_RESET_TEMPLATE.replace(/{{url}}/, verifyUrl)
        .replace(/{{user}}/, user.name)
        .replace(/{{url}}/, verifyUrl),
    };

    await transporter.sendMail(mailOptions);

    return response.json({
      success: true,
      message: "Reset token email send to user.",
    });
  } catch (error) {
    // Catch if a error occurs
    const log = new logModel({
      type: "AuthAPI",
      actionBy: userId,
      method: "Post",
      description: `The following error occured in sendResetToken.js: ${error.message}`,
    });

    await log.save();

    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default sendResetToken;
