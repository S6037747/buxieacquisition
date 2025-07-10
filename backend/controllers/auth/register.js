import crypto from "crypto";
import bcrypt from "bcryptjs";
import userModel from "../../models/userModel.js";

const register = async (request, response) => {
  const { name, password, token } = request.body;

  if (!token) {
    return response.json({
      success: false,
      tokenAuth: false,
      message: "Missing details",
    });
  }

  // Try loop to prevent script from breaking if a error accurs.
  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({ verifyToken: tokenHash });

    if (!user || user.verifyToken !== tokenHash || user.verifyToken === "") {
      return response.json({
        success: false,
        tokenAuth: false,
        message: "Token invalid",
      });
    }

    if (user.verifyTokenExpireAt < Date.now()) {
      return response.json({
        success: false,
        tokenAuth: false,
        message: "Token Expired",
      });
    }

    if (!password && user.verifyToken === tokenHash) {
      return response.json({
        success: false,
        tokenAuth: true,
        message: "Token valid",
      });
    }

    // Encrypting password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.verifyToken = "";
    user.verifyTokenExpireAt = 0;
    user.name = name;
    user.isAccountVerified = true;

    await user.save();

    return response.json({ success: true, message: "Account created." });
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default register;
