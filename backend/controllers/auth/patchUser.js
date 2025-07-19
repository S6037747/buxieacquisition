import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import logModel from "../../models/logModel.js";

const patchUser = async (request, response) => {
  const { email, password, name, userId } = request.body;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      const log = new logModel({
        type: "AuthAPI",
        actionBy: userId,
        method: "Patch",
        description: `User tried to change profile info while nog being logged in.`,
      });

      await log.save();

      return response.json({
        success: false,
        message: "User not authenticated.",
      });
    }

    if (email) {
      const log = new logModel({
        type: "AuthAPI",
        actionBy: userId,
        method: "Patch",
        description: `User changed mail from ${user.email} to ${email}.`,
      });

      await log.save();

      user.email = email;
      await user.save();

      return response.json({
        success: true,
        message: "Email successfully changed!",
      });
    }

    if (name) {
      const log = new logModel({
        type: "AuthAPI",
        actionBy: userId,
        method: "Patch",
        description: `User changed name from ${user.name} to ${name}.`,
      });

      await log.save();

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

      const log = new logModel({
        type: "AuthAPI",
        actionBy: userId,
        method: "Patch",
        description: `User changed passport.`,
      });

      await log.save();

      return response.json({
        success: true,
        message: "Password successfully changed!",
      });
    }
  } catch (error) {
    // Catch if a error occurs
    const log = new logModel({
      type: "AuthAPI",
      actionBy: userId,
      method: "Patch",
      description: `The following error has occured in PatchUser.js: ${error.message}`,
    });

    await log.save();

    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default patchUser;
