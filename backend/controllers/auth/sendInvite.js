import userModel from "../../models/userModel.js";
import transporter from "../../config/nodemailer.js";
import crypto from "crypto";
import { EMAIL_INVITE_TEMPLATE } from "../../config/emailTemplates.js";

const invite = async (request, response) => {
  const { email, userId } = request.body;

  if (!email) {
    return response.json({
      success: false,
      message: "Missing details",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return response.json({
        success: false,
        message: "User already exists.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex"); // 64-char token
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = new userModel({
      email: email,
      invitedBy: userId,
      verifyToken: tokenHash,
      verifyTokenExpireAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    const verifyUrl =
      `${process.env.CLIENT_URL || process.env.FRONTEND_URL}` +
      `/invite?token=${rawToken}`;

    // User will be saved to the database
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Invite to the Buixie Dashboard",
      html: EMAIL_INVITE_TEMPLATE.replace(/{{link}}/, verifyUrl).replace(
        /{{FRONTEND}}/g,
        process.env.FRONTEND_URL
      ),
    };

    await transporter.sendMail(mailOptions);

    return response.json({ success: true, message: "User invite send." });
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default invite;
