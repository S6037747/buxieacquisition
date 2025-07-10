import userModel from "../../models/userModel.js";

export const deleteUser = async (request, response) => {
  const { userIdDelete, userId } = request.body;

  try {
    const user = await userModel.findById(userIdDelete);
    const requestUser = await userModel.findById(userId);

    if (requestUser.role !== "admin") {
      return response.json({
        success: false,
        message: "Not Authorized",
      });
    }

    if (!user) {
      return response.json({
        success: false,
        message: "User not found",
      });
    }

    await userModel.findByIdAndDelete(userIdDelete);

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
