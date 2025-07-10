// This get userdata is for other users.

// No sensitive data to be shared like hashed passwords or Mails.

import userModel from "../../models/userModel.js";

const getUserData = async (request, response) => {
  const userId = request.params.id;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return response.json({
        success: false,
        message: "User not found",
      });
    }

    return response.json({
      success: true,
      name: user.name,
    });
  } catch (error) {
    response.json({
      success: false,
      error: error.message,
    });
  }
};

export default getUserData;
