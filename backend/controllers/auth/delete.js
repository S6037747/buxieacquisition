import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

export const deleteUser = async (request, response) => {
  const { userIdDelete, userId } = request.body;

  try {
    const user = await userModel.findById(userIdDelete);
    const requestUser = await userModel.findById(userId);

    if (requestUser.role !== "admin") {
      const log = new logModel({
        type: "CompanyAPI",
        actionBy: userId,
        method: "Delete",
        description: `User tried to delete user: ${userIdDelete}. But was not authorized.`,
      });

      await log.save();

      return response.json({
        success: false,
        message: "User not Authorized.",
      });
    }

    if (!user) {
      const log = new logModel({
        type: "CompanyAPI",
        actionBy: userId,
        method: "Delete",
        description: `User tried to delete a non-existing account.`,
      });

      await log.save();

      return response.json({
        success: false,
        message: "User not found.",
      });
    }

    await userModel.findByIdAndDelete(userIdDelete);

    const log = new logModel({
      type: "CompanyAPI",
      method: "Delete",
      actionBy: userId,
      description: `User deleted user: ${userIdAction}.`,
    });

    await log.save();

    return response.json({ success: true, message: "User deleted." });
  } catch (error) {
    // Catch if a error occurs
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

export default deleteUser;
