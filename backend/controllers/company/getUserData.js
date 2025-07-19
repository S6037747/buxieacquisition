// This get userdata is for other users.

// No sensitive data to be shared like hashed passwords or Mails.

import userModel from "../../models/userModel.js";
import logModel from "../../models/logModel.js";

const getUserData = async (request, response) => {
  const userId = request.params.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      await new logModel({
        type: "CompanyAPI",
        method: "Get",
        description: `User not found: ${userId}`,
      }).save();
      return response.json({ success: false, message: "User not found." });
    }
    return response.json({ success: true, name: user.name });
  } catch (error) {
    await new logModel({
      type: "CompanyAPI",
      method: "Get",
      description: `Error fetching user data for user ${userId}: ${error.message}`,
    }).save();
    response.json({
      success: false,
      error: error.message,
    });
  }
};

export default getUserData;
