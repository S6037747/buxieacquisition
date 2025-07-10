import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../../models/userModel.js";
import qrcode from "qrcode";
import speakeasy from "speakeasy";

export const login = async (request, response) => {
  const { email, password, totp, totpLost } = request.body;

  if (!email || !password) {
    return response.json({
      success: false,
      message: "Email or Password required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    // Checks password match and Checks if a user with a specific email exists
    if (!user) {
      return response.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.name && !user.password) {
      return response.json({
        success: false,
        message:
          "User not activated yet. Look in your email or ask a admin for a new invite.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return response.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 2FA is only active when a 2FAsecret is generated and the TOTP verification is done atleast once.

    // If 2FA is inactive and no secret key exists or if 2FA key is lost, but never activated.
    // If 2FA is lost, but it was previously verified, then the system admin has to reset it (logic will come later)
    const isFirstTimeSetup = !user.totpSecret && !user.totpActive;
    const wantsResetBeforeActivation = totpLost && !user.totpActive;

    if (isFirstTimeSetup || wantsResetBeforeActivation) {
      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        name: `BuxieAcquisition: ${user.email}`,
      });

      // Save the base32 secret
      user.totpSecret = secret.base32;
      await user.save();

      // Generate QR code from otpauth URL
      const qrCode = await qrcode.toDataURL(secret.otpauth_url);

      // Return QR code + secret to frontend
      return response.json({
        success: false,
        message: "Scan this QR code to complete 2FA setup",
        qrCode: qrCode,
        totpSecret: secret.base32,
      });
    }

    if (!totp) {
      return response.json({
        success: false,
        totpReq: true,
        totpActive: user.totpActive,
        message: "2FA code missing in API request, try again.",
      });
    }

    const isTotpValid = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: totp,
      window: 1,
    });

    if (!isTotpValid) {
      return response.json({
        success: false,
        totpReq: true,
        totpActive: user.totpActive,
        message: "2FA code is incorrect",
      });
    }

    // 2FA secret key is generated, but first time TOTP not verified.
    // This will allow for a regeneration of TOTP secret reset if lost.
    if (!user.totpActive && user.totpSecret) {
      if (isTotpValid) {
        user.totpActive = true;
        await user.save();
      }
    }

    // cookies
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.json({ success: true });
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default login;
