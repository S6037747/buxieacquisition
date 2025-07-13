import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";

const patchUser = async (request, response) => {
  const { email, password, name, userId } = request.body;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return response.json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (email) {
      user.email = email;
      await user.save();

      return response.json({
        success: true,
        message: "Email successfully changed!",
      });
    }

    if (name) {
      user.name = name;
      await user.save();

      return response.json({
        success: true,
        message: "Name successfully changed!",
      });
    }

    if (password) {
      // Encrypting password
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      await user.save();

      return response.json({
        success: true,
        message: "Password successfully changed!",
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

export default patchUser;
