import userModel from "../../models/userModel.js";
import transporter from "../../config/nodemailer.js";
import crypto from "crypto";
import { EMAIL_INVITE_TEMPLATE } from "../../config/emailTemplates.js";
import logModel from "../../models/logModel.js";

const invite = async (request, response) => {
  const { email, userId, resend } = request.body;

  if (!email) {
    const log = new logModel({
      type: "AuthAPI",
      actionBy: userId,
      method: "Post",
      description: `User tried to invite new user without a email.`,
    });

    await log.save();

    return response.json({
      success: false,
      message: "Missing details.",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser && !resend) {
      const log = new logModel({
        type: "AuthAPI",
        actionBy: userId,
        method: "Patch",
        description: `User tried inviting existing user (${existingUser._id}).`,
      });

      await log.save();

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

    if (!resend) {
      const user = new userModel({
        email: email,
        invitedBy: userId,
        verifyToken: tokenHash,
        verifyTokenExpireAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      // User will be saved to the database
      const log = new logModel({
        type: "AuthAPI",
        actionBy: userId,
        method: "Post",
        description: `User a invitation to user with email: ${email}.`,
      });

      await log.save();

      await user.save();
    } else {
      existingUser.verifyToken = tokenHash;
      existingUser.verifyTokenExpireAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      const log = new logModel({
        type: "AuthAPI",
        actionBy: userId,
        method: "Post",
        description: `User resended a invite to user with email: ${email}`,
      });

      await log.save();

      existingUser.save();
    }

    const verifyUrl =
      `${process.env.CLIENT_URL || process.env.FRONTEND_URL}` +
      `/invite?token=${rawToken}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Invite to the Buixie Dashboard",
      html: EMAIL_INVITE_TEMPLATE.replace(/{{url}}/, verifyUrl).replace(
        /{{url}}/,
        verifyUrl
      ),
    };

    await transporter.sendMail(mailOptions);

    return response.json({ success: true, message: "User invite send." });
  } catch (error) {
    // Catch if a error occurs
    const log = new logModel({
      type: "AuthAPI",
      actionBy: userId,
      method: "Post",
      description: `The following error occured in sendInvite.js: ${error.message}`,
    });

    await log.save();

    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default invite;
